function MessagesLoadingSkeleton() {
  return (
    <div className="space-y-4 p-2">
      {/* Left-aligned skeleton */}
      <div className="flex justify-start">
        <div className="w-[55%] space-y-2 animate-pulse">
          <div className="h-16 bg-navy-700/40 rounded-2xl rounded-bl-sm" />
          <div className="h-2 bg-navy-700/30 rounded-full w-16" />
        </div>
      </div>

      {/* Right-aligned skeleton */}
      <div className="flex justify-end">
        <div className="w-[45%] space-y-2 animate-pulse">
          <div className="h-12 bg-cyan-500/10 rounded-2xl rounded-br-sm" />
          <div className="h-2 bg-navy-700/30 rounded-full w-16 ml-auto" />
        </div>
      </div>

      {/* Left-aligned skeleton */}
      <div className="flex justify-start">
        <div className="w-[40%] space-y-2 animate-pulse">
          <div className="h-10 bg-navy-700/40 rounded-2xl rounded-bl-sm" />
          <div className="h-2 bg-navy-700/30 rounded-full w-16" />
        </div>
      </div>

      {/* Right-aligned skeleton */}
      <div className="flex justify-end">
        <div className="w-[60%] space-y-2 animate-pulse">
          <div className="h-20 bg-cyan-500/10 rounded-2xl rounded-br-sm" />
          <div className="h-2 bg-navy-700/30 rounded-full w-16 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export default MessagesLoadingSkeleton;