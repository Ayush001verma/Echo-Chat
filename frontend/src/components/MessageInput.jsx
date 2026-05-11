import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Paperclip, SendIcon, XIcon, Smile, Sparkles } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import AIWritingAssistant from "./AIWritingAssistant";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socket && selectedUser && !selectedUser.isAI) socket.emit("stopTyping", { receiverId: selectedUser._id });

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
      setShowAIAssistant(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTyping = () => {
    if (!socket || !selectedUser || selectedUser.isAI) return;
    
    socket.emit("typing", { receiverId: selectedUser._id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 2000);
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    handleTyping();
  };

  const handleOpenAI = () => {
    if (!text.trim()) {
      toast("Type a message first, then use AI Assistant ✨", { icon: "💡" });
      return;
    }
    setShowEmojiPicker(false);
    setShowAIAssistant(true);
  };

  const handleAIReplace = (newText) => {
    setText(newText);
    setShowAIAssistant(false);
  };

  return (
    <div className="px-4 py-3 relative" style={{ background: "var(--bg-panel)", borderTop: "1px solid var(--border-subtle)" }}>

      {/* AI Writing Assistant Panel */}
      {showAIAssistant && (
        <AIWritingAssistant
          inputText={text}
          onClose={() => setShowAIAssistant(false)}
          onReplace={handleAIReplace}
        />
      )}

      {/* Emoji picker overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-40 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
          <EmojiPicker
            theme="dark"
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="w-full mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-cyan-500/15"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-slate-200 hover:bg-red-500/20 hover:text-red-400 border border-cyan-500/10 transition-all"
              type="button"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="w-full flex items-center gap-3">
        
        {/* Left Icons: Emoji & Attachment */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full transition-all ${
              showEmojiPicker ? "text-[#00a884] bg-[#2a3942]" : "text-[#8696a0] hover:text-[#aebac1]"
            }`}
          >
            <Smile className="w-6 h-6" />
          </button>

          {!selectedUser?.isAI && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition-all ${
                imagePreview ? "text-[#00a884] bg-[#2a3942]" : "text-[#8696a0] hover:text-[#aebac1]"
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          )}

          {/* AI Assistant trigger button */}
          {!selectedUser?.isAI && (
            <button
              type="button"
              id="ai-assistant-trigger"
              onClick={handleOpenAI}
              disabled={!text.trim()}
              className="ai-trigger-btn shrink-0 ml-1"
              title="AI Writing Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>AI</span>
            </button>
          )}
        </div>

        <div className="flex-1 rounded-2xl px-4 py-2.5 transition-all"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)" }}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"}
          onBlur={e => e.currentTarget.style.borderColor = "var(--border-soft)"}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            className="w-full bg-transparent text-[15px] focus:outline-none"
            style={{ color: "var(--text-primary)" }}
            placeholder="Type a message..."
            // placeholder color via CSS variable fallback
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
          onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "linear-gradient(135deg,#a78bfa,#7c3aed)")}
          onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg,#7c3aed,#6366f1)")}        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;