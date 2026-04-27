import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Video, Phone, MoreHorizontal, ShieldCheck, Bell } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser, toggleRightPanel, initiateCall, isCalling } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedUser, setSelectedUser]);

  if (!selectedUser) return null;

  const isGroup = selectedUser?.members ? true : false;
  const displayName = isGroup ? selectedUser.name : selectedUser.fullName;

  const displayImage = isGroup
    ? (selectedUser.groupImage || "/avatar.png")
    : (selectedUser.profilePic || "/avatar.png");

  const isUserOnline = onlineUsers.includes(selectedUser._id);
  const statusText = isGroup
    ? `${selectedUser.members.length} Members`
    : (isUserOnline ? "Online" : "Offline");

  const handleStartCall = () => {
    if (!isGroup) {
      initiateCall(selectedUser._id);
    }
  };

  return (
    <div className="flex justify-between items-center glass-panel-strong border-b border-cyan-500/10 px-4 py-3 shrink-0">
      {/* Left: User identity */}
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button
          className="p-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all md:hidden"
          onClick={() => setSelectedUser(null)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Clickable user info */}
        <div
          onClick={toggleRightPanel}
          className="flex items-center gap-3 cursor-pointer hover:bg-cyan-500/5 p-1.5 rounded-xl transition-all flex-1 min-w-0"
        >
          <div className="relative shrink-0">
            {isGroup ? (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg ring-2 ring-cyan-500/15">
                {displayName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <>
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500/15"
                />
                {isUserOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-navy-800" />
                )}
              </>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-slate-100 font-semibold text-sm truncate">{displayName}</h3>
            <p className={`text-xs truncate ${isUserOnline || isGroup ? "text-emerald-400" : "text-slate-500"}`}>
              {statusText}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-1 ml-2 shrink-0">
        <button
          className="p-2.5 rounded-lg text-yellow-500/80 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all relative hidden lg:flex mt-1 mr-1"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center text-[9px] text-zinc-900 font-bold border-2 border-[#162132]">1</span>
        </button>

        {/* Security badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full bg-yellow-500/10 text-yellow-500/90 border border-yellow-500/30 mr-2 hidden lg:flex mt-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured | Rate-Limit Check</span>
        </div>

        {!isGroup && (
          <>
            <button
              onClick={handleStartCall}
              disabled={isCalling}
              className="p-2.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all disabled:opacity-30"
              title="Voice Call"
            >
              <Phone className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleStartCall}
              disabled={isCalling}
              className="p-2.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all disabled:opacity-30"
              title="Video Call"
            >
              <Video className="w-4.5 h-4.5" />
            </button>
          </>
        )}

        <button
          onClick={toggleRightPanel}
          className="p-2.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all"
          title="More options"
        >
          <MoreHorizontal className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;