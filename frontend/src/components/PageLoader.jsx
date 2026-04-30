import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-navy-900 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/10">
          <LoaderIcon className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">Loading Echo.in...</p>
    </div>
  );
}

export default PageLoader;