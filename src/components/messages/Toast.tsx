export default function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="fixed left-1/2 top-6 z-[80] -translate-x-1/2 animate-[dropDown_0.2s_ease-out] rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      {message}
      <style>{`@keyframes dropDown { from { opacity: 0; transform: translate(-50%, -8px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  )
}
