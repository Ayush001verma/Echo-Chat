import React from 'react';
import { Shield, Zap, MessageSquare } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden no-chat-bg">

      {/* Ambient glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
      <div className="absolute w-72 h-72 rounded-full pointer-events-none bottom-10 right-10"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
      <div className="absolute w-56 h-56 rounded-full pointer-events-none top-20 left-10"
        style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.04) 0%, transparent 70%)" }} />

      {/* Central Icon */}
      <div className="relative mb-8 z-10 animate-float">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-3xl opacity-40"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(99,102,241,0.3))", filter: "blur(16px)", transform: "scale(1.3)" }} />

        <div className="w-28 h-28 rounded-3xl flex items-center justify-center relative"
          style={{
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.15)",
            backdropFilter: "blur(20px)",
          }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6366f1, #4f46e5)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}>
            <MessageSquare className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Ping badge */}
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 0 2px #06060f, 0 0 10px rgba(16,185,129,0.6)" }}>
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* Text */}
      <div className="text-center px-8 z-10">
        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span style={{ color: "var(--text-primary)" }}>Welcome to </span>
          <span style={{
            background: "linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Echo.in</span>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
          Select a conversation to start chatting, or explore your contacts and groups.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-10 z-10 px-8">
        {[
          { icon: Zap,           label: "AI-Powered",          from: "rgba(124,58,237,0.15)", to: "rgba(99,102,241,0.1)",  border: "rgba(124,58,237,0.25)", color: "#a78bfa" },
          { icon: Shield,        label: "End-to-End Encrypted", from: "rgba(16,185,129,0.12)", to: "rgba(5,150,105,0.08)", border: "rgba(16,185,129,0.2)",  color: "#6ee7b7" },
          { icon: MessageSquare, label: "Real-Time",            from: "rgba(168,85,247,0.15)", to: "rgba(236,72,153,0.08)", border: "rgba(168,85,247,0.25)", color: "#d8b4fe" },
        ].map(({ icon: Icon, label, from, to, border, color }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${from}, ${to})`,
              border: `1px solid ${border}`,
              color,
              backdropFilter: "blur(12px)",
            }}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-6 flex items-center gap-1.5 text-xs z-10" style={{ color: "var(--text-muted)" }}>
        <Shield className="w-3 h-3" />
        <span>Your messages are private and secure</span>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;