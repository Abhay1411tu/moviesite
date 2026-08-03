export function SkeletonCard() {
  return (
    <div className="rounded-3xl glass-card overflow-hidden flex flex-col h-full">
      <div className="h-44 skeleton" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="h-5 w-2/3 rounded-lg skeleton" />
          <div className="h-6 w-12 rounded-lg skeleton" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full rounded-md skeleton" />
          <div className="h-3 w-4/5 rounded-md skeleton" />
          <div className="h-3 w-3/5 rounded-md skeleton" />
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="h-6 w-16 rounded-md skeleton" />
          <div className="h-6 w-20 rounded-md skeleton" />
          <div className="h-6 w-14 rounded-md skeleton" />
        </div>
        <div className="mt-auto h-10 w-full rounded-xl skeleton" />
      </div>
    </div>
  );
}
