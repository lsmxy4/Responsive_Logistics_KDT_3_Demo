import { forwardRef, useState } from 'react'
import Reveal from '../Reveal'
import { useInView } from '../../hooks/useInView'
import { Route, Fuel, Clock, TrendingUp, TrendingDown, ChevronDown, MapPin, Navigation } from '../icons'
import {
  ROUTE_KPIS,
  RECOMMENDED_ROUTES,
  ROUTE_DETAILS,
  ROUTE_ANALYSIS,
  ROUTE_ANALYSIS_PERIODS,
  ROUTE_IMPROVEMENTS,
  ROUTE_HIGHLIGHTS,
} from '../../data/operate'
import { Panel, PageSectionHeader, TINT } from './shared'

const KPI_ICONS = {
  distance: Route,
  fuel: Fuel,
  time: Clock,
  efficiency: TrendingUp,
} as const

const HIGHLIGHT_ICONS = {
  distance: Route,
  fuel: Fuel,
  time: Clock,
} as const

/** 추천 경로 미니맵 — 정적 데모용 경로 라인 */
function RouteMapPreview() {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke="#e2e8f0" strokeWidth="0.4" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 12.5} x2="100" y2={i * 12.5} stroke="#e2e8f0" strokeWidth="0.4" />
        ))}
        <path d="M50 50 L26 24 L14 40 L30 20" fill="none" stroke="#0ea5e9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 50 L68 30 L82 46 L70 66" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 50 L40 76 L62 84" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="4" fill="#0f172a" />
        {[
          [26, 24],
          [14, 40],
          [30, 20],
          [68, 30],
          [82, 46],
          [70, 66],
          [40, 76],
          [62, 84],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" stroke="#0ea5e9" strokeWidth="1.2" />
        ))}
      </svg>
      <span className="absolute left-1/2 top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-slate-900 text-white shadow">
        <Navigation className="h-3 w-3" />
      </span>
    </div>
  )
}

function RecommendedRoutesCard() {
  return (
    <Panel title="최적 경로 추천" delay={0}>
      <RouteMapPreview />
      <ul className="mt-4 space-y-2">
        {RECOMMENDED_ROUTES.map((r) => (
          <li key={r.id} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
            <span className="flex-1 text-slate-500">
              {r.label} ({r.stops}곳)
            </span>
            <b className="tabular-nums font-bold text-slate-800">{r.distanceKm}km</b>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function RouteDetailCard() {
  const [routeId, setRouteId] = useState(1)
  const detail = ROUTE_DETAILS[routeId]

  return (
    <Panel
      title="경로 상세 정보"
      delay={80}
      action={
        <div className="relative">
          <select
            value={routeId}
            onChange={(e) => setRouteId(Number(e.target.value))}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-[12.5px] font-semibold text-slate-600 outline-none transition-colors focus:border-sky-400"
          >
            {RECOMMENDED_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      }
    >
      <ol className="relative flex-1 space-y-4 pl-1">
        {detail.stops.map((s, i) => {
          const isEdge = s.order === 'start' || s.order === 'end'
          return (
            <li key={i} className="relative flex gap-3 pl-6">
              {i !== detail.stops.length - 1 && (
                <span className="absolute left-[9px] top-6 h-full w-px bg-slate-200" aria-hidden="true" />
              )}
              <span
                className={`absolute left-0 top-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                  isEdge ? 'bg-slate-900 text-white' : 'bg-sky-500 text-white'
                }`}
              >
                {isEdge ? <MapPin className="h-2.5 w-2.5" /> : s.order}
              </span>
              <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <b className="block truncate text-[13px] font-semibold text-slate-800">{s.name}</b>
                  <span className="text-[11.5px] text-slate-400">{s.address}</span>
                </div>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-500">{s.time}</span>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
        <div>
          <span className="block text-[11px] text-slate-400">총 거리</span>
          <b className="text-[14px] font-extrabold tabular-nums text-slate-900">{detail.totalDistanceKm}km</b>
        </div>
        <div>
          <span className="block text-[11px] text-slate-400">예상 시간</span>
          <b className="text-[14px] font-extrabold tabular-nums text-slate-900">{detail.estimatedTime}</b>
        </div>
        <div>
          <span className="block text-[11px] text-slate-400">배송 건수</span>
          <b className="text-[14px] font-extrabold tabular-nums text-slate-900">{detail.deliveryCount}건</b>
        </div>
      </div>
    </Panel>
  )
}

/** 5축 레이더 차트 */
function RadarChart() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const size = 220
  const cx = size / 2
  const cy = size / 2 - 6
  const R = 78
  const axes = ROUTE_ANALYSIS
  const angleFor = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2

  const pointAt = (i: number, ratio: number) => {
    const a = angleFor(i)
    return { x: cx + Math.cos(a) * R * ratio, y: cy + Math.sin(a) * R * ratio }
  }

  const dataPoints = axes.map((d, i) => pointAt(i, inView ? d.value / 100 : 0))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-56 w-56">
        {rings.map((ratio) => {
          const pts = axes.map((_, i) => pointAt(i, ratio))
          return (
            <polygon
              key={ratio}
              points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          )
        })}
        {axes.map((_, i) => {
          const p = pointAt(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />
        })}
        <path
          d={dataPath}
          fill="#8b5cf6"
          fillOpacity="0.18"
          stroke="#8b5cf6"
          strokeWidth="2"
          style={{ transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}
        />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8b5cf6" style={{ transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
        ))}
        {axes.map((d, i) => {
          const p = pointAt(i, 1.28)
          return (
            <text key={d.axis} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="9.5" fill="#64748b" fontWeight="600">
              {d.axis}
            </text>
          )
        })}
      </svg>
      <ul className="mt-2 grid w-full grid-cols-2 gap-x-4 gap-y-1.5">
        {axes.map((d) => (
          <li key={d.axis} className="flex items-center justify-between text-[11.5px]">
            <span className="text-slate-500">{d.axis}</span>
            <b className="tabular-nums font-bold text-slate-800">{d.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RouteAnalysisCard() {
  const [period, setPeriod] = useState<(typeof ROUTE_ANALYSIS_PERIODS)[number]>('전체 기간')
  return (
    <Panel
      title="경로 분석"
      delay={160}
      action={
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as (typeof ROUTE_ANALYSIS_PERIODS)[number])}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-[12.5px] font-semibold text-slate-600 outline-none transition-colors focus:border-sky-400"
          >
            {ROUTE_ANALYSIS_PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      }
    >
      <RadarChart />
      <div className="mt-4 border-t border-slate-100 pt-4">
        <span className="text-[11px] font-bold tracking-wide text-slate-400">개선 제안</span>
        <ul className="mt-2 space-y-2">
          {ROUTE_IMPROVEMENTS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

function RouteHighlightBanner() {
  return (
    <Panel title="이달의 최적화 하이라이트" delay={0} className="lg:col-span-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ROUTE_HIGHLIGHTS.map((h, i) => {
          const Icon = HIGHLIGHT_ICONS[h.icon]
          return (
            <Reveal key={h.icon} delay={i * 60} className="flex gap-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${TINT[ROUTE_KPIS.find((k) => k.key === h.icon)?.tint ?? 'sky']}`}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[12.5px] leading-relaxed text-slate-500">{h.text}</p>
            </Reveal>
          )
        })}
      </div>
    </Panel>
  )
}

const RouteOptimizationSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section
      ref={ref}
      id="route-optimization"
      className="mt-10 scroll-mt-20 lg:mt-14 lg:min-h-screen lg:scroll-mt-8"
    >
      <Reveal>
        <PageSectionHeader title="경로 최적화" desc="AI 기반 최적 경로를 설계하고 효율성을 분석할 수 있습니다." />
      </Reveal>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {ROUTE_KPIS.map((k, i) => {
          const Icon = KPI_ICONS[k.key as keyof typeof KPI_ICONS]
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
                <span className="text-[12px] font-medium text-slate-400">{k.unit}</span>
              </div>
              <span
                className={`mt-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  k.up ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
                }`}
              >
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                전일 대비 {k.diff}
              </span>
            </Reveal>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecommendedRoutesCard />
        <RouteDetailCard />
        <RouteAnalysisCard />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3">
        <RouteHighlightBanner />
      </div>
    </section>
  )
})

RouteOptimizationSection.displayName = 'RouteOptimizationSection'
export default RouteOptimizationSection
