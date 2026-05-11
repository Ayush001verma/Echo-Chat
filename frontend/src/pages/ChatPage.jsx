import React from 'react'
import { useChatStore } from '../store/useChatStore'
import ProfileHeader from '../components/ProfileHeader'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import ChatsList from '../components/ChatsList'
import ContactList from '../components/ContactList'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'
import VideoCall from '../components/VideoCall'
import { PhoneOff, Video } from 'lucide-react'

function ChatPage() {
  const {
    activeTab,
    selectedUser,
    isCalling,
    isIncoming,
    callData,
    acceptIncomingCall,
    endCall
  } = useChatStore();

  return (
    <div className='h-[100dvh] w-full flex overflow-hidden relative chat-page-bg'>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 overflow-hidden w-full h-full">

        {/* Sidebar */}
        <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-[380px] sidebar-panel flex-col`}>
          <ProfileHeader />
          <ActiveTabSwitch />



          <div className='flex-1 overflow-y-auto sidebar-list'>
            {activeTab === 'chats'
              ? <ChatsList />
              : activeTab === 'contacts'
              ? <ContactList />
              : <ChatsList groupsOnly />}
          </div>
        </div>

        {/* Chat viewport */}
        <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 flex-col relative`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>

      {/* ── Incoming Call Overlay ── */}
      {isIncoming && !isCalling && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 incoming-call-card p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 4px 16px rgba(124,58,237,0.4), 0 0 0 2px rgba(124,58,237,0.2)" }}>
            {callData?.name ? callData.name.charAt(0) : "?"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>{callData?.name || "Unknown User"}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: "#a78bfa" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Incoming Video Call...
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={acceptIncomingCall} className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30" title="Accept">
              <Video size={18} />
            </button>
            <button onClick={() => endCall(callData?.from)} className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-all shadow-lg shadow-red-500/30" title="Decline">
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      )}

      {/* WebRTC session */}
      {isCalling && <VideoCall />}
    </div>
  )
}

export default ChatPage