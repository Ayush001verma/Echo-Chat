function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#0a1628,#0f1d32_50%,#0a1628)_padding-box,conic-gradient(from_var(--border-angle),rgba(22,42,70,0.48)_80%,_#06b6d4_86%,_#22d3ee_90%,_#06b6d4_94%,_rgba(22,42,70,0.48))_border-box] rounded-2xl border border-transparent animate-border flex overflow-hidden">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;