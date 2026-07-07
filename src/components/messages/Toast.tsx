export default function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-[popUp_0.2s_ease-out] rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      {message}
      <style>{`@keyframes popUp { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  )
}
