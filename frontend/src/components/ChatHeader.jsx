import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Video, Phone, MoreVertical } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser, toggleRightPanel, initiateCall, isCalling } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") setSelectedUser(null); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedUser, setSelectedUser]);

  if (!selectedUser) return null;

  const isAI    = selectedUser?.isAI;
  const isGroup = !!selectedUser?.members;
  const displayName  = isGroup ? selectedUser.name : selectedUser.fullName;
  const displayImage = isGroup
    ? (selectedUser.groupImage || "/avatar.png")
    : (selectedUser.profilePic || "/avatar.png");

  const isUserOnline = onlineUsers.includes(selectedUser._id) || isAI;
  const statusText   = isGroup
    ? `${selectedUser.members.length} members`
    : (isAI ? "Always here to help ✨" : (isUserOnline ? "Online" : "Offline"));

  const ActionBtn = ({ onClick, disabled, title, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={e => { e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.background = "rgba(124,58,237,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );

  return (
    <div className="chat-header-bar flex-shrink-0 flex items-center justify-between px-4 h-[62px]">
      {/* Left */}
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        <button
          className="p-2 rounded-full transition-all md:hidden shrink-0"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setSelectedUser(null)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={toggleRightPanel}
          className="flex items-center gap-3 flex-1 min-w-0 rounded-xl px-2 py-1.5 -ml-1 transition-all text-left"
          style={{ background: "transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            {isGroup ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            ) : isAI ? (
              <div className="w-10 h-10 rounded-full p-0.5"
                style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed,#6366f1)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
                <img src={displayImage} alt={displayName} className="w-full h-full object-cover rounded-full"
                  style={{ background: "var(--bg-panel)" }} />
              </div>
            ) : (
              <img src={displayImage} alt={displayName} className="w-10 h-10 rounded-full object-cover"
                style={{ boxShadow: isUserOnline ? "0 0 0 2px rgba(16,185,129,0.4)" : "0 0 0 2px rgba(124,58,237,0.15)" }} />
            )}

            {isUserOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                style={{
                  background: isAI ? "linear-gradient(135deg,#a78bfa,#7c3aed)" : "#10b981",
                  boxShadow: isAI ? "0 0 0 2px #0d0d1f, 0 0 8px rgba(167,139,250,0.9)" : "0 0 0 2px #0d0d1f, 0 0 6px rgba(16,185,129,0.6)",
                }} />
            )}
          </div>

          {/* Name & status */}
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{displayName}</span>
            <span className="text-[11.5px] truncate" style={{ color: isAI ? "#a78bfa" : isUserOnline ? "#10b981" : "var(--text-muted)" }}>
              {statusText}
            </span>
          </div>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {!isGroup && !isAI && (
          <>
            <ActionBtn onClick={() => initiateCall(selectedUser._id)} disabled={isCalling} title="Voice Call">
              <Phone className="w-4.5 h-4.5" size={18} />
            </ActionBtn>
            <ActionBtn onClick={() => initiateCall(selectedUser._id)} disabled={isCalling} title="Video Call">
              <Video className="w-4.5 h-4.5" size={18} />
            </ActionBtn>
          </>
        )}
        <ActionBtn onClick={toggleRightPanel} title="Info">
          <MoreVertical className="w-4.5 h-4.5" size={18} />
        </ActionBtn>
      </div>
    </div>
  );
}

export default ChatHeader;