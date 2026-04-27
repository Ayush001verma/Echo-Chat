import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Paperclip, SendIcon, XIcon, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socket && selectedUser) socket.emit("stopTyping", { receiverId: selectedUser._id });

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
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
    if (!socket || !selectedUser) return;
    
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

  return (
    <div className="px-4 py-3 border-t border-cyan-500/8 glass-panel-strong relative">

      {/* Emoji picker overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-40 shadow-2xl rounded-2xl overflow-hidden border border-cyan-500/10">
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
      <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-navy-800/80 border border-cyan-500/10 rounded-full px-4 py-2 focus-within:border-cyan-500/25 focus-within:ring-1 focus-within:ring-cyan-500/10 transition-all">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            className="flex-1 min-w-0 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            placeholder="Type your secure message..."
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 rounded-full transition-all ${
              imagePreview
                ? "text-cyan-400 bg-cyan-500/10"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`hidden sm:flex p-1.5 rounded-full transition-all ${
              showEmojiPicker
                ? "text-cyan-400 bg-cyan-500/10"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            <Smile className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-center hover:from-cyan-400 hover:to-teal-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <SendIcon className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;