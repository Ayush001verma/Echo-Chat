import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { Trash2, MoreVertical } from "lucide-react";

const Message = ({ message }) => {
    const { authUser } = useAuthStore();
    const { selectedUser, deleteMessage } = useChatStore();

    const isOwnMessage = message.senderId === authUser._id;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            deleteMessage(message._id);
        }
        setIsMenuOpen(false);
    };

    // System messages
    if (message.isSystemMessage) {
        return (
            <div className="flex justify-center my-6 w-full">
                <div className="bg-navy-700/50 text-slate-400 px-4 py-1.5 rounded-full text-[11px] font-medium border border-cyan-500/10 tracking-wide uppercase italic">
                    {message.text}
                </div>
            </div>
        );
    }

    // Resolve sender identity
    let senderProfilePic = isOwnMessage ? authUser.profilePic : selectedUser.profilePic;
    let senderName = null;

    if (selectedUser?.members) {
        const sender = selectedUser.members.find(m => m._id === message.senderId);
        if (sender) {
            senderProfilePic = sender.profilePic;
            senderName = sender.fullName;
        } else if (isOwnMessage) {
            senderProfilePic = authUser.profilePic;
            senderName = "You";
        } else {
            senderProfilePic = "/avatar.png";
            senderName = "User";
        }
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 300;
    const isLongMessage = message.text && message.text.length > MAX_LENGTH;

    const timeString = new Date(message.createdAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`flex gap-2.5 max-w-[75%] md:max-w-[65%] lg:max-w-[55%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>

                {/* Avatar (group chats) */}
                {selectedUser?.members && (
                    <div className="shrink-0 self-end">
                        <img
                            alt="avatar"
                            src={senderProfilePic || "/avatar.png"}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/10"
                        />
                    </div>
                )}

                {/* Message content */}
                <div className="flex flex-col">
                    {/* Sender name (group chats, other users) */}
                    {selectedUser?.members && !isOwnMessage && (
                        <span className="text-[11px] text-cyan-400 font-medium mb-1 ml-1">{senderName}</span>
                    )}

                    {/* Bubble */}
                    <div
                        className={`relative group px-4 py-2.5 ${
                            isOwnMessage ? "msg-bubble-own" : "msg-bubble-other"
                        }`}
                    >
                        {/* Image */}
                        {message.image && (
                            <img
                                src={message.image}
                                alt="Shared"
                                className="rounded-lg max-h-48 object-cover mb-2 w-full"
                            />
                        )}

                        {/* Text */}
                        {message.text && (
                            <p className="text-[13.5px] leading-relaxed text-slate-100 break-words">
                                {isExpanded || !isLongMessage
                                    ? message.text
                                    : `${message.text.slice(0, MAX_LENGTH)}...`}
                                {isLongMessage && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="font-semibold cursor-pointer ml-1 text-xs text-cyan-400 hover:text-cyan-300"
                                    >
                                        {isExpanded ? "Read less" : "Read more"}
                                    </button>
                                )}
                            </p>
                        )}

                        {/* Timestamp */}
                        <p className={`text-[10px] mt-1.5 block text-right ${
                            isOwnMessage ? "text-cyan-300/50" : "text-slate-500"
                        }`}>
                            {timeString}
                        </p>

                        {/* Delete menu (own messages) */}
                        {isOwnMessage && (
                            <div className="absolute -top-1 -right-1" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`p-1 rounded-full bg-navy-700/80 hover:bg-navy-600 transition-all ${
                                        isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    } text-slate-300 border border-cyan-500/10`}
                                    title="Message options"
                                >
                                    <MoreVertical size={13} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-1 w-32 glass-panel-strong rounded-xl shadow-2xl z-50 overflow-hidden border border-cyan-500/10">
                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;