function UsersLoadingSkeleton() {
  const skeletonItems = Array(6).fill(null);

  return (
    <div className="space-y-2 px-1">
      {skeletonItems.map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
          <div className="w-11 h-11 rounded-full bg-navy-700/60 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-navy-700/60 rounded-full w-3/4" />
            <div className="h-2.5 bg-navy-700/40 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;