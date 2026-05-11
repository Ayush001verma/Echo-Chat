import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList({ groupsOnly = false }) {
  const {
    chats, getMyChatPartners, isUserLoading,
    selectedUser, setSelectedUser,
    groups, getGroups, isGroupsLoading
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
    getGroups();
  }, [getMyChatPartners, getGroups]);

  if (isUserLoading || isGroupsLoading) return <UsersLoadingSkeleton />;

  /* Group avatar */
  const GroupAvatar = ({ name }) => (
    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
      style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)", boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );

  /* Online dot */
  const OnlineDot = ({ glow = false }) => (
    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
      style={{
        background: glow ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "#10b981",
        boxShadow: glow ? "0 0 0 2px #0d0d1f, 0 0 8px rgba(167,139,250,0.9)" : "0 0 0 2px #0d0d1f, 0 0 6px rgba(16,185,129,0.6)",
      }} />
  );

  if (groupsOnly) {
    if (groups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-14 text-center space-y-3 px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}>👥</div>
          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>No groups yet</h4>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Create a group to chat with multiple people</p>
        </div>
      );
    }
    return (
      <div className="py-2">
        {groups.map((group) => (
          <div key={group._id} onClick={() => setSelectedUser(group)}
            className={`chat-row ${selectedUser?._id === group._id ? "chat-row-active" : ""}`}>
            <GroupAvatar name={group.name} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{group.name}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{group.members.length} members</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-1">
      {/* Groups */}
      {groups.length > 0 && (
        <div className="mb-1">
          <div className="section-label">Groups</div>
          {groups.map((group) => (
            <div key={group._id} onClick={() => setSelectedUser(group)}
              className={`chat-row ${selectedUser?._id === group._id ? "chat-row-active" : ""}`}>
              <GroupAvatar name={group.name} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{group.name}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{group.members.length} members</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DMs */}
      <div>
        {groups.length > 0 && <div className="section-label">Direct Messages</div>}

        {/* Echo AI */}
        <div
          onClick={() => setSelectedUser({ _id: "echo-ai", fullName: "Echo AI", isAI: true, profilePic: "https://api.dicebear.com/7.x/bottts/svg?seed=echo" })}
          className={`chat-row ${selectedUser?._id === "echo-ai" ? "chat-row-active" : ""}`}
        >
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full p-0.5"
              style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed, #6366f1)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=echo" alt="Echo AI"
                className="w-full h-full object-cover rounded-full"
                style={{ background: "var(--bg-panel)" }} />
            </div>
            <OnlineDot glow />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate flex items-center gap-1.5" style={{ color: "#c4b5fd" }}>
              Echo AI
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>AI</span>
            </div>
            <div className="text-xs" style={{ color: "rgba(167,139,250,0.55)" }}>Always here to help ✨</div>
          </div>
        </div>

        {/* Real users */}
        {chats.map((chat) => {
          const isOnline = onlineUsers.includes(chat._id);
          return (
            <div key={chat._id} onClick={() => setSelectedUser(chat)}
              className={`chat-row ${selectedUser?._id === chat._id ? "chat-row-active" : ""}`}>
              <div className="relative shrink-0">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName}
                  className="w-11 h-11 object-cover rounded-full"
                  style={{ boxShadow: isOnline ? "0 0 0 2px rgba(16,185,129,0.3)" : "none" }} />
                {isOnline && <OnlineDot />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{chat.fullName}</div>
                <div className="text-xs flex items-center gap-1" style={{ color: isOnline ? "#10b981" : "var(--text-muted)" }}>
                  {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatsList;