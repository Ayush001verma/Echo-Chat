import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList({ groupsOnly = false }) {
  const {
    chats,
    getMyChatPartners,
    isUserLoading,
    selectedUser,
    setSelectedUser,
    groups,
    getGroups,
    isGroupsLoading
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
    getGroups();
  }, [getMyChatPartners, getGroups]);

  if (isUserLoading || isGroupsLoading) {
    return <UsersLoadingSkeleton />;
  }

  // Groups-only mode for the Groups tab
  if (groupsOnly) {
    if (groups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
          <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h4 className="text-slate-200 font-medium text-sm mb-1">No groups yet</h4>
            <p className="text-slate-500 text-xs px-6">Create a group to start chatting with multiple people</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto space-y-1">
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => setSelectedUser(group)}
            className={`chat-item ${selectedUser?._id === group._id ? "chat-item-active" : ""}`}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0 ring-2 ring-cyan-500/10">
              {group.name.charAt(0).toUpperCase()}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="font-medium text-sm text-slate-200 truncate">{group.name}</div>
              <div className="text-xs text-slate-500">
                {group.members.length} members
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0 && groups.length === 0) return <NoChatsFound />;

  return (
    <div className="flex-1 overflow-y-auto space-y-1">

      {/* Groups section */}
      {groups.length > 0 && (
        <div className="mb-3">
          <div className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-1">
            Groups
          </div>
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => setSelectedUser(group)}
              className={`chat-item ${selectedUser?._id === group._id ? "chat-item-active" : ""}`}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0 ring-2 ring-cyan-500/10">
                {group.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-left min-w-0 flex-1">
                <div className="font-medium text-sm text-slate-200 truncate">{group.name}</div>
                <div className="text-xs text-slate-500">
                  {group.members.length} members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Direct messages section */}
      {chats.length > 0 && (
        <div>
          {groups.length > 0 && (
            <div className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Direct Messages
            </div>
          )}

          {chats.map((chat) => {
            const isOnline = onlineUsers.includes(chat._id);
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedUser(chat)}
                className={`chat-item ${selectedUser?._id === chat._id ? "chat-item-active" : ""}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullName}
                    className="w-11 h-11 object-cover rounded-full ring-2 ring-transparent"
                    style={isOnline ? { boxShadow: '0 0 0 2px #22c55e' } : {}}
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-navy-800" />
                  )}
                </div>

                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-sm text-slate-200 truncate">{chat.fullName}</div>
                  <div className={`text-xs ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Online pulse indicator */}
                {isOnline && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChatsList;