"use client";

import { useEffect, useRef, useState } from "react";

const hasSpeechRecognition = () =>
  typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

export default function VoiceInput({ onTranscript, isProcessing }) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    setSupported(hasSpeechRecognition());
    if (!hasSpeechRecognition()) {
      console.warn("🎤 Web Speech API not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => { console.log("🎤 [ASR] Listening started"); setListening(true); };
    rec.onerror = (e) => { console.error("🎤 [ASR] Error:", e); setListening(false); };
    rec.onend = () => { console.log("🎤 [ASR] Listening ended"); setListening(false); };
    rec.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log("🎤 [ASR] Partial/Final:", transcript);
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal && transcript.trim()) onTranscript?.(transcript.trim());
    };

    recognitionRef.current = rec;
    return () => {
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, [onTranscript]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    try {
      listening ? recognitionRef.current.stop() : recognitionRef.current.start();
    } catch (e) {
      console.error("🎤 [ASR] Start/Stop error:", e);
    }
  };

  if (!supported) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-300">
        <div className="font-medium mb-2">Voice Input</div>
        <p className="text-sm">Web Speech API not supported. Use the text box or Chrome/Edge desktop.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-100">Voice Input</div>
        <div className="text-xs text-gray-400">
          {listening ? "Listening..." : isProcessing ? "Processing..." : "Click the mic to speak"}
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        className={[
          "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
          listening ? "bg-red-600 border-red-500 shadow-lg animate-pulse" : "bg-gray-700 hover:bg-gray-600 border-gray-600",
        ].join(" ")}
        aria-label={listening ? "Stop listening" : "Start listening"}
      >
        <span className="text-white text-xl">🎤</span>
      </button>
    </div>
  );
}
