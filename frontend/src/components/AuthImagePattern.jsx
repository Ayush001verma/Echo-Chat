import { MessageSquare } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-navy-800/50 p-12 relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5" />
            
            <div className="max-w-md text-center relative z-10">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl ${
                                i % 3 === 0
                                    ? "bg-cyan-500/10 border border-cyan-500/10"
                                    : i % 2 === 0
                                        ? "bg-teal-500/8 border border-teal-500/8 animate-pulse"
                                        : "bg-navy-700/40 border border-navy-600/30"
                            } ${i === 4 ? "flex items-center justify-center" : ""}`}
                        >
                            {i === 4 && (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-teal-500/30 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-100">{title}</h2>
                <p className="text-slate-400">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
