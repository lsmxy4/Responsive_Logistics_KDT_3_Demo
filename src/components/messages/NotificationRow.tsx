import { CheckCircle2 } from 'lucide-react'
import { TONE, SEVERITY_TONE, type NotificationItem, type NotificationAction } from '../../data/messages'

export default function NotificationRow({
  item,
  idx,
  selected,
  onSelect,
  onRead,
  onAction,
}: {
  item: NotificationItem
  idx: number
  selected: boolean
  onSelect: (id: string) => void
  onRead: (id: string) => void
  onAction: (id: string, action: NotificationAction) => void
}) {
  const tone = TONE[SEVERITY_TONE[item.severity]]
  const Icon = item.icon

  return (
    <li
      style={{ animationDelay: `${idx * 40}ms` }}
      onClick={() => item.unread && onRead(item.id)}
      className={`group flex animate-[fadeIn_0.4s_ease-out_both] flex-col gap-3 border-b border-slate-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:px-6 ${
        item.severity === 'urgent' && !item.resolved ? 'bg-rose-50/40' : ''
      }`}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <input
          type="checkbox"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onSelect(item.id)}
          className="mt-1 h-4 w-4 shrink-0 accent-sky-500 sm:mt-0"
        />
        <span
          className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white ${
            item.resolved ? 'bg-slate-300' : tone.icon
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className={`truncate text-sm font-bold sm:text-[15px] ${
              item.resolved ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
            }`}
          >
            {item.title}
          </p>
          {item.unread && <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-rose-500" />}
        </div>
        <p className={`mt-0.5 line-clamp-2 text-xs sm:text-sm ${item.resolved ? 'text-slate-400' : 'text-slate-500'}`}>
          {item.desc}
        </p>

        {/* mobile meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tone.badge}`}>{item.tag}</span>
          <span className="text-[11px] text-slate-400">{item.time}</span>
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex sm:w-24">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone.badge}`}>{item.tag}</span>
        <span className="text-xs text-slate-400">{item.time}</span>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:w-40 sm:justify-end" onClick={(e) => e.stopPropagation()}>
        {item.resolved ? (
          <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> {item.resolvedLabel || '처리완료'}
          </span>
        ) : (
          (item.actions ?? []).map((a) => (
            <button
              key={a.key}
              onClick={() => onAction(item.id, a)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${TONE[a.tone].btn}`}
            >
              {a.label}
            </button>
          ))
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </li>
  )
}
