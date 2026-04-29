import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/10">
        <MessageCircleIcon className="w-7 h-7 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium text-sm mb-1">No conversations yet</h4>
        <p className="text-slate-500 text-xs px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/8 rounded-full border border-cyan-500/15 hover:bg-cyan-500/15 transition-all"
      >
        Find contacts
      </button>
    </div>
  );
}

export default NoChatsFound;