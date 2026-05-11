import { MessageCircleIcon, Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, selectedUser } = useChatStore();
  const isGroup = selectedUser?.members && selectedUser.members.length > 0;

  const handleQuickReply = async (text) => {
    try { await sendMessage({ text }); } catch (error) { console.error(error); }
  };

  const suggestions = isGroup
    ? [
        { label: "👋 Break the Ice", text: "Hello everyone! 👋" },
        { label: "🚀 Let's Start",   text: "Let's get things started! 🚀" },
        { label: "❓ Status Check",  text: "What is the update? ❓" },
      ]
    : [
        { label: "👋 Say Hello",    text: "Hello! 👋" },
        { label: "🤔 How are you?", text: "How are you doing? 🤔" },
        { label: "☕ Catch up?",    text: "Free for a coffee chat? ☕" },
      ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl opacity-40"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.5),rgba(99,102,241,0.3))", filter: "blur(14px)", transform: "scale(1.25)" }} />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 8px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
          <MessageCircleIcon className="w-8 h-8 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
        {isGroup ? (
          <>Welcome to the <span style={{ color: "#a78bfa" }}>{name}</span> Group!</>
        ) : (
          <>Start chatting with <span style={{ color: "#a78bfa" }}>{name}</span></>
        )}
      </h3>

      <div className="flex flex-col space-y-3 max-w-md mb-8">
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {isGroup
            ? "Everyone is here! Send a message to break the ice."
            : "This is the very beginning of your conversation. Say hello!"}
        </p>
        <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.35),transparent)" }} />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleQuickReply(s.text)}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#a78bfa",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)"; }}
          >
            {s.label}
            <Send className="w-3 h-3 opacity-0 -ml-2 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;