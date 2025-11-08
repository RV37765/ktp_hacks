"use client";

import { useEffect, useRef } from "react";

export default function ChatLog({ messages = [], isProcessing = false }) {
  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isProcessing]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 h-[50vh] overflow-auto">
      <div className="space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={[
              "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
              m.role === "user"
                ? "bg-blue-600/20 border border-blue-600/40 text-blue-100"
                : "bg-emerald-600/15 border border-emerald-600/40 text-emerald-100",
            ].join(" ")}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">
              {m.role === "user" ? "You" : "ArtGuard AI"}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
        {isProcessing && (
          <div className="rounded-lg px-3 py-2 text-sm bg-gray-700/60 border border-gray-600 text-gray-200">
            <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">ArtGuard AI</div>
            <div className="animate-pulse">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
