export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 skeleton rounded-full" />
          <div className="h-3 w-20 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
        <div className="h-5 skeleton w-4/5" />
        <div className="h-4 skeleton w-full" />
        <div className="h-4 skeleton w-3/4" />
        <div className="border-t border-slate-800 pt-3 flex justify-between">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-12 skeleton" />
        </div>
      </div>
    </div>
  )
}
