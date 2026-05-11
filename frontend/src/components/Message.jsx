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
                <div className="px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide uppercase italic"
                  style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.12)", color: "var(--text-muted)" }}>
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
                        <span className="text-[11px] font-medium mb-1 ml-1" style={{ color: "#a78bfa" }}>{senderName}</span>
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
                            <p className="text-[14.5px] leading-relaxed break-words">
                                {isExpanded || !isLongMessage
                                    ? message.text
                                    : `${message.text.slice(0, MAX_LENGTH)}...`}
                                {isLongMessage && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="font-semibold cursor-pointer ml-1 text-xs hover:underline"
                                        style={{ color: "#a78bfa" }}
                                    >
                                        {isExpanded ? "Read less" : "Read more"}
                                    </button>
                                )}
                            </p>
                        )}

                        {/* Timestamp */}
                        <p className={`text-[10px] mt-1 block text-right ${
                            isOwnMessage ? "text-[#e9edef]/70" : "text-[#8696a0]"
                        }`}>
                            {timeString}
                        </p>

                        {/* Delete menu (own messages) */}
                        {isOwnMessage && (
                            <div className="absolute -top-2 -right-2" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`p-1 rounded-full shadow-sm transition-all ${
                                        isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    }`}
                                    style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                                    title="Message options"
                                >
                                    <MoreVertical size={14} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-1 w-32 rounded-xl shadow-xl z-50 overflow-hidden"
                                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-soft)" }}>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
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