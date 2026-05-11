import { useState, useRef } from "react";
import { LogOutIcon, Camera, Settings } from "lucide-react";
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
    <div className="profile-header-bar flex-shrink-0 flex items-center justify-between px-4 h-[64px]">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <button
            className="w-10 h-10 rounded-full overflow-hidden transition-all duration-200"
            style={{ boxShadow: "0 0 0 2px rgba(124,58,237,0.35), 0 0 12px rgba(124,58,237,0.15)" }}
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </button>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full"
            style={{ boxShadow: "0 0 0 2px #0d0d1f, 0 0 6px rgba(16,185,129,0.6)" }} />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Logo */}
        <h1 className="text-[19px] font-extrabold tracking-tight select-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="text-white">Echo</span>
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #7c3aed, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>.in</span>
        </h1>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-0.5 relative">
        {/* New chat */}
        <button className="p-2 rounded-full transition-all duration-200 text-[#5a5880] hover:text-[#a78bfa] hover:bg-[rgba(124,58,237,0.1)]" title="New Chat">
          <svg viewBox="0 0 24 24" height="19" width="19" fill="currentColor">
            <path d="M19.005,3.175H4.674C3.642,3.175,3,3.789,3,4.821V21.02l3.544-3.514h12.461c1.033,0,2.064-1.06,2.064-2.093V4.821C21.068,3.789,20.036,3.175,19.005,3.175z M14.016,13.044H7.041V11.1h6.975V13.044z M17.016,9.044H7.041V7.1h9.975V9.044z" />
          </svg>
        </button>

        {/* Settings / Menu */}
        <button
          className="p-2 rounded-full transition-all duration-200 text-[#5a5880] hover:text-[#a78bfa] hover:bg-[rgba(124,58,237,0.1)]"
          onClick={() => setShowMenu(!showMenu)}
          title="Menu"
        >
          <Settings className="w-4.5 h-4.5" size={19} />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl z-50 overflow-hidden animate-fade-in"
              style={{
                background: "rgba(10,10,24,0.97)",
                border: "1px solid rgba(124,58,237,0.2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.08), 0 0 30px rgba(124,58,237,0.08)"
              }}>
              {/* Header */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
                <div className="flex items-center gap-2.5">
                  <img src={selectedImg || authUser?.profilePic || "/avatar.png"} alt=""
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ boxShadow: "0 0 0 1px rgba(124,58,237,0.3)" }} />
                  <div>
                    <p className="text-sm font-semibold text-white truncate">{authUser?.fullName}</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { logout(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;