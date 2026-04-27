import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUserLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUserLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className={`chat-item ${selectedUser?._id === contact._id ? "chat-item-active" : ""}`}
          >
            <div className="relative shrink-0">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="w-11 h-11 object-cover rounded-full ring-2 ring-transparent"
                style={isOnline ? { boxShadow: '0 0 0 2px #22c55e' } : {}}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-navy-800" />
              )}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="font-medium text-sm text-slate-200 truncate">{contact.fullName}</div>
              <div className={`text-xs ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>

            {isOnline && (
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            )}
          </div>
        );
      })}
    </>
  );
}

export default ContactList;