import React from 'react'
import { MessageSquare, Shield, Zap } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-16 bg-navy-900 h-full">
      {/* Animated icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-teal-500/15 flex items-center justify-center animate-pulse border border-cyan-500/10">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome to Echo.in!</h2>
      <p className="text-slate-400 text-sm mb-8 max-w-sm text-center leading-relaxed">
        Select a conversation from the sidebar to start messaging, or find new contacts to connect with.
      </p>

      {/* Feature badges */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/8 border border-cyan-500/10 text-xs text-cyan-400">
          <Shield className="w-3.5 h-3.5" />
          End-to-end secure
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/10 text-xs text-emerald-400">
          <Zap className="w-3.5 h-3.5" />
          Real-time messaging
        </div>
      </div>
    </div>
  );
}

export default NoConversationPlaceholder;