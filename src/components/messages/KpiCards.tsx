import { Bell, TriangleAlert, CheckCircle2 } from 'lucide-react'
import type { IconType } from '../../data/messages'

type Kpi = { label: string; value: number; unit: string; icon: IconType; tone: string; pulse?: boolean }

export default function KpiCards({
  totalCount,
  unreadCount,
  urgentCount,
  resolvedTodayCount,
  mounted,
}: {
  totalCount: number
  unreadCount: number
  urgentCount: number
  resolvedTodayCount: number
  mounted: boolean
}) {
  const kpis: Kpi[] = [
    { label: '전체 알림', value: totalCount, unit: '건', icon: Bell, tone: 'text-slate-900' },
    { label: '읽지 않음', value: unreadCount, unit: '건', icon: Bell, tone: 'text-rose-500', pulse: unreadCount > 0 },
    { label: '긴급 알림', value: urgentCount, unit: '건', icon: TriangleAlert, tone: 'text-amber-500' },
    { label: '오늘 처리', value: resolvedTodayCount, unit: '건', icon: CheckCircle2, tone: 'text-emerald-500' },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {kpis.map((k, idx) => (
        <div
          key={k.label}
          style={{ transitionDelay: `${100 + idx * 60}ms` }}
          className={`rounded-2xl border border-white bg-white/70 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-5 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 sm:text-sm">{k.label}</span>
            <span className={`relative grid h-7 w-7 place-items-center rounded-lg bg-slate-50 ${k.tone}`}>
              <k.icon className="h-4 w-4" />
              {k.pulse && <span className="absolute inset-0 animate-ping rounded-lg bg-rose-400 opacity-30" />}
            </span>
          </div>
          <p className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${k.tone}`}>
            {k.value}
            <span className="ml-1 text-sm font-semibold text-slate-400">{k.unit}</span>
          </p>
        </div>
      ))}
    </div>
  )
}
