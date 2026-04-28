import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Search } from "lucide-react";

const CreateGroupModal = ({ onClose }) => {
  const {
    allContacts,
    getAllContacts,
    createGroup,
    isCreatingGroup
  } = useChatStore();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filteredUsers = (allContacts || []).filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length < 2) return;
    await createGroup({ name: groupName, members: selectedUsers });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="glass-panel-strong p-6 rounded-2xl w-full max-w-md shadow-2xl border border-cyan-500/10 flex flex-col gap-4 h-[500px] animate-fade-in">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">New Group</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Group Name (e.g. Project Alpha)"
            className="w-full bg-navy-800/80 border border-cyan-500/10 rounded-xl py-2.5 px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/20 transition-all"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-navy-800/80 border border-cyan-500/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto border border-cyan-500/8 rounded-xl p-2 bg-navy-900/50">
          {filteredUsers.length === 0 ? (
            <div className="text-center p-4 text-slate-500 text-sm">No contacts found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleToggleUser(user._id)}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                  selectedUsers.includes(user._id)
                    ? "bg-cyan-500/10 border border-cyan-500/20"
                    : "hover:bg-navy-700/50 border border-transparent"
                }`}
              >
                <div className="avatar placeholder shrink-0">
                  <div className="bg-navy-600 text-cyan-300 rounded-full w-8">
                    <span className="text-xs font-medium">{user.fullName[0]}</span>
                  </div>
                </div>
                <span className="flex-1 font-medium text-sm text-slate-200 truncate">{user.fullName}</span>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  readOnly
                  className="checkbox checkbox-primary checkbox-sm pointer-events-none"
                />
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/30 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/15"
            disabled={isCreatingGroup || !groupName || selectedUsers.length < 2}
          >
            {isCreatingGroup ? "Creating..." : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateGroupModal;