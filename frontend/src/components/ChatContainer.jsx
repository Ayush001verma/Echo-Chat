import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import Message from "./Message";
import GroupInfo from "./GroupInfo";

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages, isRightPanelOpen, typingUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return unsubscribeFromMessages;
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main chat viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader />

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 wa-chat-bg">
          <div className="relative">
            {messages.length > 0 && !isMessagesLoading ? (
              <div className="w-full space-y-4">
                {messages.map((msg) => (
                  <Message key={msg._id} message={msg} />
                ))}
              </div>
            ) : isMessagesLoading ? (
              <MessagesLoadingSkeleton />
            ) : (
              <NoChatHistoryPlaceholder name={selectedUser.fullName || selectedUser.name} />
            )}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Typing indicator */}
        {typingUsers.includes(selectedUser?._id) && (
          <div className="px-5 py-2" style={{ background: "var(--bg-panel)", borderTop: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-2">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="text-xs italic" style={{ color: "var(--text-muted)" }}>typing...</span>
            </div>
          </div>
        )}

        <MessageInput />
      </div>

      {/* Right panel */}
      {isRightPanelOpen && (
        <GroupInfo />
      )}
    </div>
  );
}

export default ChatContainer;