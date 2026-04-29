import { MessageCircleIcon, Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, selectedUser } = useChatStore();

  const isGroup = selectedUser?.members && selectedUser.members.length > 0;

  const handleQuickReply = async (text) => {
    try {
      await sendMessage({ text });
    } catch (error) {
      console.error("Failed to send quick reply:", error);
    }
  };

  const suggestions = isGroup
    ? [
      { label: "👋 Break the Ice", text: "Hello everyone! 👋" },
      { label: "🚀 Let's Start", text: "Let's get things started! 🚀" },
      { label: "❓ Status Check", text: "What is the update? ❓" },
    ]
    : [
      { label: "👋 Say Hello", text: "Hello! 👋" },
      { label: "🤔 How are you?", text: "How are you doing? 🤔" },
      { label: "☕ Catch up?", text: "Free for a coffee chat? ☕" },
    ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-2xl flex items-center justify-center mb-5 animate-pulse border border-cyan-500/10">
        <MessageCircleIcon className="w-8 h-8 text-cyan-400" />
      </div>

      <h3 className="text-xl font-semibold text-slate-100 mb-2">
        {isGroup ? (
          <>Welcome to the <span className="text-cyan-400">{name}</span> Group!</>
        ) : (
          <>Start chatting with <span className="text-cyan-400">{name}</span></>
        )}
      </h3>

      <div className="flex flex-col space-y-3 max-w-md mb-8">
        <p className="text-slate-400 text-sm leading-relaxed">
          {isGroup
            ? "Everyone is here! Send a message to break the ice and get the discussion rolling."
            : "This is the very beginning of your conversation. Say hello to start connecting!"}
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleQuickReply(suggestion.text)}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/8 rounded-full border border-cyan-500/15 hover:bg-cyan-500/15 hover:text-cyan-300 transition-all active:scale-95"
          >
            {suggestion.label}
            <Send className="w-3 h-3 opacity-0 -ml-2 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;