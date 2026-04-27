import React from 'react'
import { useChatStore } from '../store/useChatStore'
import ProfileHeader from '../components/ProfileHeader'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import ChatsList from '../components/ChatsList'
import ContactList from '../components/ContactList'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'
import VideoCall from '../components/VideoCall'
import { PhoneOff, Video, MessageSquare, Search } from 'lucide-react'

function ChatPage() {
  const {
    activeTab,
    selectedUser,
    isCalling,
    isIncoming,
    callData,
    answerCall,
    acceptIncomingCall,
    endCall
  } = useChatStore();

  return (
    <div className='h-[100dvh] w-full flex flex-col overflow-hidden relative bg-navy-900'>

      {/* ── Top Branding Bar ── */}
      <div className="flex items-center gap-2.5 px-5 py-3 glass-panel-strong border-b border-cyan-500/10 z-10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-slate-100">Echo</span>
          <span className="text-cyan-400">.in</span>
        </h1>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Primary navigation pane */}
        <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-[340px] lg:w-[380px] glass-panel-strong flex-col border-r border-cyan-500/8`}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="px-3 py-2 mt-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search groups & messages" className="w-full bg-navy-800/60 border border-cyan-500/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/30" />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto px-3 py-2 space-y-1'>
            {activeTab === 'chats' ? <ChatsList /> : activeTab === 'contacts' ? <ContactList /> : <ChatsList groupsOnly />}
          </div>
        </div>

        {/* Active conversation viewport */}
        <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 flex-col bg-navy-900`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>

      {/* ── Status Footer Bar ── */}
      <div className="flex items-center justify-end gap-4 px-5 py-1.5 glass-panel-strong border-t border-cyan-500/8 shrink-0">
        <span className="text-[10px] text-slate-500">
          Theme: <span className="text-cyan-400 font-semibold">Premium Dark (Customizable)</span>
        </span>
        <span className="text-[10px] text-slate-500">
          Redis: <span className="text-emerald-400 font-semibold">Active (Optimized)</span>
        </span>
      </div>

      {/* ── Incoming Call Overlay ── */}
      {isIncoming && !isCalling && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 glass-panel-strong p-4 rounded-2xl shadow-2xl z-50 border border-cyan-500/20 flex items-center gap-4 animate-bounce glow-cyan">
          <div className="avatar placeholder">
            <div className="bg-navy-600 text-cyan-300 rounded-full w-12 ring ring-cyan-500/30 ring-offset-navy-900 ring-offset-2">
              <span className="text-xl font-bold uppercase">
                {callData?.name ? callData.name.charAt(0) : "?"}
              </span>
            </div>
          </div>

          <div>
            <p className="font-bold text-lg text-slate-100">{callData?.name || "Unknown User"}</p>
            <p className="text-xs text-cyan-400/70">Incoming Video Call...</p>
          </div>

          <div className="flex gap-2 ml-4">
            <button
              onClick={acceptIncomingCall}
              className="btn btn-circle btn-success text-white shadow-lg shadow-green-500/20"
              title="Accept Call"
            >
              <Video size={20} />
            </button>

            <button
              onClick={() => endCall(callData?.from)}
              className="btn btn-circle btn-error text-white shadow-lg shadow-red-500/20"
              title="Decline Call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}

      {/* WebRTC active session viewport */}
      {isCalling && (
        <VideoCall />
      )}

    </div>
  )
}

export default ChatPage