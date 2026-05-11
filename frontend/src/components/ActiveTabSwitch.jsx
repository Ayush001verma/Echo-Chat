import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageSquare, Users, UsersRound, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const tabs = [
    { id: "chats",    label: "Chats",    icon: MessageSquare },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "groups",   label: "Groups",   icon: UsersRound },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "var(--bg-panel)", borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Pill tab switcher */}
        <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.1)" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200"
              style={
                activeTab === id
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                      color: "white",
                      boxShadow: "0 2px 12px rgba(124,58,237,0.35), 0 0 0 1px rgba(124,58,237,0.2)",
                    }
                  : { color: "var(--text-muted)" }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "groups" && (
          <button
            onClick={() => setShowCreateGroup(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.22)",
              color: "#a78bfa",
            }}
            title="Create Group"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </>
  );
}

export default ActiveTabSwitch;