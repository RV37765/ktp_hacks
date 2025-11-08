"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import VoiceInput from "@/components/VoiceInput";
import ChatLog from "@/components/ChatLog";
import { museumData } from "@/lib/museumData";
import { getSmartResponse } from "@/lib/smartResponses";
import { speak, isSupported as ttsSupported, stop as stopTTS } from "@/lib/textToSpeech";

const HEADER_TITLE = "ArtGuard AI";
const MAX_MESSAGES = 200;

function CameraGridPlaceholder({ cameras = [], focusedCamera }) {
  const ids = cameras.length ? cameras.map((c) => c.id) : [1, 2, 3, 4];
  return (
    <div className="grid grid-cols-2 gap-3">
      {ids.slice(0, 4).map((id) => (
        <div
          key={id}
          className={[
            "h-40 rounded-lg flex items-center justify-center border",
            focusedCamera === id ? "bg-gray-700 border-emerald-500" : "bg-gray-700/60 border-gray-600",
          ].join(" ")}
        >
          <div className="text-gray-200">📹 Camera {id}{focusedCamera === id ? " (focused)" : ""}</div>
        </div>
      ))}
    </div>
  );
}

function AlertPanelPlaceholder({ alerts = [] }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <div className="text-gray-100 font-medium mb-2">Alerts</div>
      {alerts.length === 0 ? (
        <div className="text-gray-400 text-sm">No active alerts.</div>
      ) : (
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className="text-sm bg-gray-700/60 border border-gray-600 rounded p-2 text-gray-200">
              <span className="font-semibold mr-2">[{a.severity.toUpperCase()}]</span>
              {a.message} <span className="opacity-70">({a.time})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "System online. Say “status report” or try “help” to see commands." },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedCamera, setFocusedCamera] = useState(null);
  const [input, setInput] = useState("");

  const context = useMemo(() => museumData, []);

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [...prev, { role, content }].slice(-MAX_MESSAGES));
  }, []);

  const applyEffects = useCallback((effects) => {
    if (!effects) return;
    if (typeof effects.focusCameraId !== "undefined") {
      setFocusedCamera(effects.focusCameraId);
      console.log("📹 [UI] focusCameraId:", effects.focusCameraId);
    }
    if (effects.showAllCameras) {
      setFocusedCamera(null);
      console.log("📹 [UI] showAllCameras");
    }
    if (effects.emergency) {
      console.warn("🚨 [EMERGENCY]:", effects.emergency);
    }
  }, []);

  const handleCommand = useCallback(
    async (commandText) => {
      if (!commandText?.trim()) return;
      addMessage("user", commandText);
      setIsProcessing(true);
      try {
        const result = getSmartResponse(commandText, context);
        console.log("🤖 [Smart] Result:", result);
        addMessage("assistant", result.text);
        applyEffects(result.effects);
        if (ttsSupported()) await speak(result.text);
      } catch (e) {
        console.error("🤖 [Smart] Exception:", e);
        addMessage("assistant", "I hit an error processing that command.");
      } finally {
        setIsProcessing(false);
      }
    },
    [addMessage, applyEffects, context]
  );

  useEffect(() => () => stopTTS(), []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{HEADER_TITLE}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
            <span className="text-gray-300">Online</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <VoiceInput onTranscript={handleCommand} isProcessing={isProcessing} />
          <ChatLog messages={messages} isProcessing={isProcessing} />
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder='Type a command (e.g., "show camera 2")'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = input.trim();
                  if (v) { setInput(""); handleCommand(v); }
                }
              }}
            />
            <button
              className="px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              onClick={() => { const v = input.trim(); if (v) { setInput(""); handleCommand(v); } }}
            >
              Send
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-100 font-medium">Camera Feeds</div>
              <div className="text-xs text-gray-400">{focusedCamera ? `Focused: ${focusedCamera}` : "All feeds"}</div>
            </div>
            <CameraGridPlaceholder cameras={context.cameras} focusedCamera={focusedCamera} />
          </div>

          <AlertPanelPlaceholder alerts={context.alerts} />

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
            <div className="font-medium text-gray-100 mb-2">Stats</div>
            <div className="flex gap-6">
              <div>{context.cameras.filter((c) => c.status === "active").length}/{context.cameras.length} cameras online</div>
              <div>{context.guards.filter((g) => g.status === "on-duty").length}/{context.guards.length} guards on duty</div>
              <div>{context.alerts.length} active alerts</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
