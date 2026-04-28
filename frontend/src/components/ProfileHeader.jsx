import { useState, useRef } from "react";
import { LogOutIcon, Settings, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 border-b border-cyan-500/8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User avatar with online ring */}
          <div className="relative">
            <button
              className="w-12 h-12 rounded-full overflow-hidden relative group ring-2 ring-cyan-500/20 hover:ring-cyan-500/40 transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[10px] font-medium">Edit</span>
              </div>
            </button>

            {/* Green online dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-navy-800 z-10" />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* User info */}
          <div>
            <h3 className="text-slate-100 font-semibold text-sm max-w-[160px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online
            </p>
          </div>
        </div>

        {/* Settings button with dropdown */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Settings className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 glass-panel-strong rounded-xl shadow-2xl z-50 overflow-hidden border border-cyan-500/10 animate-fade-in">
                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;