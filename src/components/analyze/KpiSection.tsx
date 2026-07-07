import Reveal from '../Reveal'
import { CheckCircle, Clock, TrendingUp, TrendingDown, Wallet } from '../icons'
import { ANALYTICS_BY_PERIOD, COMPARE_LABEL, type AnalyzePeriod } from '../../data/analyze'
import { TINT } from './shared'

const KPI_ICONS = {
  check: CheckCircle,
  clock: Clock,
  trend: TrendingUp,
  wallet: Wallet,
} as const

export default function KpiSection({ period }: { period: AnalyzePeriod }) {
  const kpis = ANALYTICS_BY_PERIOD[period].kpis
  const compareLabel = COMPARE_LABEL[period]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {kpis.map((k, i) => {
        const Icon = KPI_ICONS[k.icon]
        const isDown = k.diff.trim().startsWith('-')
        return (
          <Reveal
            key={k.key}
            delay={i * 60}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/5 sm:p-5"
          >
            <div className="flex items-center gap-2.5">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${TINT[k.tint]}`}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[12.5px] font-medium text-slate-500">{k.label}</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <b className="text-[24px] font-extrabold tabular-nums tracking-tight text-slate-900">{k.value}</b>
              {k.unit && <span className="text-[13px] font-semibold text-slate-400">{k.unit}</span>}
            </div>
            <span
              className={`mt-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                k.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
              }`}
            >
              {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {k.diff} {compareLabel}
            </span>
          </Reveal>
        )
      })}
    </div>
  )
}
