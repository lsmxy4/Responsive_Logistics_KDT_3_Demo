import Reveal from '../Reveal'
import { Sparkles, TrendingUp, Clock, MapPin, Thermometer } from '../icons'
import { ANALYTICS_BY_PERIOD, COMPARE_LABEL, type AnalyzePeriod } from '../../data/analyze'

const INSIGHT_ICONS = {
  trend: TrendingUp,
  clock: Clock,
  map: MapPin,
  thermometer: Thermometer,
} as const

export default function AiInsightCard({ period }: { period: AnalyzePeriod }) {
  const insights = ANALYTICS_BY_PERIOD[period].aiInsights
  const compareLabel = COMPARE_LABEL[period]

  return (
    <Reveal delay={200} className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-white shadow-sm shadow-violet-500/30">
          <Sparkles className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-[16px] font-extrabold text-slate-900">AI 분석 리포트</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => {
          const Icon = INSIGHT_ICONS[insight.icon]
          return (
            <div key={insight.title} className="flex items-start gap-3 rounded-xl border border-violet-100/80 bg-white/80 p-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-600">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 leading-snug">
                <p className="text-[13px] font-bold text-slate-800">{insight.title}</p>
                <span className="text-[11.5px] text-slate-400">{compareLabel}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-[11.5px] text-slate-400">AI 분석은 참고용으로 실제 운영과 다를 수 있습니다.</p>
    </Reveal>
  )
}
