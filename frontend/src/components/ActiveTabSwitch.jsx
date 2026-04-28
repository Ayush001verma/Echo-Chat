import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Plus, MessageSquare, Users, UsersRound } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const tabs = [
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "groups", label: "Groups", icon: UsersRound },
  ];

  return (
    <>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-cyan-500/8">
        <div className="flex flex-1 gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`chat-tab flex-1 ${
                activeTab === id ? "chat-tab-active" : "chat-tab-inactive"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Create group - visible when on groups tab */}
        {activeTab === "groups" && (
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all ml-1"
            title="Create New Group"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
    </>
  );
}

export default ActiveTabSwitch;