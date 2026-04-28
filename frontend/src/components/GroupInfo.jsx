import { LogOut, Trash2, Shield, MoreVertical, ShieldCheck, X, Calendar, Search, UserPlus } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";

const GroupInfo = () => {
    const { selectedUser, closeRightPanel, toggleAdmin, removeFromGroup, leaveGroup, allContacts, addMembersToGroup, getAllContacts } = useChatStore();
    const { onlineUsers, authUser } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");

    if (!selectedUser) return null;

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    const isGroup = !!selectedUser.members;

    const isAdmin = (userId) => {
        if (!selectedUser.admin) return false;
        return selectedUser.admin.some(admin => admin._id === userId);
    };

    const amIAdmin = isGroup && isAdmin(authUser._id);

    const availableUsers = allContacts.filter(u =>
        u._id !== authUser._id &&
        !selectedUser.members?.some(m => m._id === u._id) &&
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleLeaveGroup = () => {
        if (window.confirm("Are you sure you want to leave this group?")) {
            leaveGroup(selectedUser._id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 w-full bg-navy-900 transition-all duration-700 lg:static lg:w-96 lg:border-l lg:border-cyan-500/8 h-full flex flex-col glass-panel-strong">
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between sticky top-0 bg-navy-800/80 backdrop-blur-lg z-10">
                <h3 className="font-semibold text-lg text-slate-100">{isGroup ? "Group Info" : "Contact Info"}</h3>
                <button onClick={closeRightPanel} className="p-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Profile section */}
                <div className="flex flex-col items-center gap-3 p-6 border-b border-cyan-500/8">
                    <div className="relative">
                        {isGroup ? (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-3xl ring-2 ring-cyan-500/15">
                                {(selectedUser.name || "G").charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-cyan-500/20">
                                <img
                                    src={selectedUser.profilePic || "/avatar.png"}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-100">{isGroup ? selectedUser.name : selectedUser.fullName}</h2>
                        {isGroup && (
                            <p className="text-sm text-slate-400 mt-1">
                                {selectedUser.members.length} members
                            </p>
                        )}
                    </div>
                </div>

                {/* Add member */}
                {isGroup && (
                    <div className="p-4 border-b border-cyan-500/8 bg-navy-800/30">
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">Add Member</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-navy-800/80 border border-cyan-500/10 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {searchTerm && (
                            <div className="mt-2 max-h-48 overflow-y-auto border border-cyan-500/10 rounded-xl bg-navy-900/80 shadow-2xl">
                                {availableUsers.length > 0 ? (
                                    availableUsers.map(user => (
                                        <button
                                            key={user._id}
                                            onClick={() => {
                                                addMembersToGroup(selectedUser._id, [user._id]);
                                                setSearchTerm("");
                                            }}
                                            className="flex items-center gap-3 w-full p-2.5 hover:bg-cyan-500/5 transition-colors border-b border-cyan-500/5 last:border-0"
                                        >
                                            <img src={user.profilePic || "/avatar.png"} className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/10" />
                                            <span className="text-sm font-medium flex-1 truncate text-slate-200">{user.fullName}</span>
                                            <UserPlus className="w-4 h-4 text-cyan-400" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-xs text-center text-slate-500">No new users found</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Created date */}
                <div className="p-4 border-b border-cyan-500/8 flex gap-3 items-center text-sm text-slate-400">
                    <Calendar className="w-5 h-5 text-cyan-400/50" />
                    <span>{isGroup ? "Created" : "Joined"}: {formatDate(selectedUser.createdAt)}</span>
                </div>

                {/* Members list */}
                {isGroup && (
                    <div className="p-4">
                        <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-wider">
                            Members
                        </h3>

                        <div className="flex flex-col gap-1">
                            {selectedUser.members.map((member) => {
                                const isMemberAdmin = isAdmin(member._id);
                                const isOnline = onlineUsers.includes(member._id);

                                return (
                                    <div key={member._id} className="flex items-center justify-between p-2.5 hover:bg-cyan-500/5 rounded-xl transition-colors group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={member.profilePic || "/avatar.png"}
                                                    alt={member.fullName}
                                                    className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500/10"
                                                />
                                                {isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-navy-800" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate text-sm text-slate-200">{member.fullName}</span>
                                                    {isMemberAdmin && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                                                </div>
                                                <div className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {isOnline ? "Online" : "Offline"}
                                                </div>
                                            </div>
                                        </div>

                                        {amIAdmin && member._id !== authUser._id && (
                                            <div className="dropdown dropdown-left dropdown-end">
                                                <div tabIndex={0} role="button" className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl glass-panel-strong rounded-xl w-48 border border-cyan-500/10">
                                                    <li>
                                                        <button onClick={() => toggleAdmin(selectedUser._id, member._id)} className="text-slate-200 hover:bg-cyan-500/10">
                                                            <Shield className="w-4 h-4 text-cyan-400" />
                                                            {isMemberAdmin ? "Remove Admin" : "Make Admin"}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={() => removeFromGroup(selectedUser._id, member._id)}
                                                            className="text-red-400 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove Member
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Leave group button */}
            {isGroup && (
                <div className="p-4 border-t border-cyan-500/8 shrink-0">
                    <button
                        onClick={handleLeaveGroup}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/8 rounded-xl border border-red-500/15 hover:bg-red-500/15 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Leave Group
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupInfo;