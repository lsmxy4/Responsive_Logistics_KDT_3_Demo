import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import {
  Package,
  Truck,
  Route,
  Warehouse,
  Users,
  BarChart,
  Bell,
  Thermometer,
  CheckCircle,
  TriangleAlert,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Star,
} from '../components/icons'
import {
  KPIS,
  ORDER_STATUS,
  ORDER_TOTAL,
  DELIVERY,
  ROUTE_METRICS,
  WAREHOUSES,
  DRIVERS,
  TOP_DRIVERS,
  WEEKLY,
  WEEK_INBOUND,
  WEEK_OUTBOUND,
  ALERTS,
  type Tint,
} from '../data/dashboard'
/* ── 공용 유틸 ───────────────────────────────────────────────── */
const isFigma = typeof window !== 'undefined' && window.location.search.includes('figma=1')

const TINT: Record<Tint, string> = {
  sky: 'bg-sky-50 text-sky-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-500',
  cyan: 'bg-cyan-50 text-cyan-600',
}

const KPI_ICONS = {
  orders: Package,
  transit: Truck,
  ontime: CheckCircle,
  warehouse: Warehouse,
  drivers: Users,
  temp: Thermometer,
} as const

function Sk({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} aria-hidden="true" />
}

function TrendChip({ trend }: { trend: number }) {
  const up = trend >= 0
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
        up ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
      }`}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? '+' : ''}
      {trend}%
    </span>
  )
}

/* ── 도메인 카드 래퍼 (헤더 아이콘 + 제목 + 자세히 링크) ──────── */
function DomainCard({
  icon,
  title,
  to,
  tint,
  delay = 0,
  className = '',
  children,
}: {
  icon: ReactNode
  title: string
  to: string
  tint: Tint
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <Reveal
      delay={delay}
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md hover:shadow-slate-900/5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${TINT[tint]}`}>{icon}</span>
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        </div>
        <Link
          to={to}
          className="group inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[12px] font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-sky-600"
        >
          자세히
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </Reveal>
  )
}

function SectionLabel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-3 mt-8 flex items-baseline gap-2.5">
      <h2 className="text-[15px] font-extrabold text-slate-900">{title}</h2>
      <span className="text-[12.5px] text-slate-400">{desc}</span>
    </div>
  )
}

/* ── 상단 KPI 타일 ───────────────────────────────────────────── */
function KpiTile({ kpi, loading, delay }: { kpi: (typeof KPIS)[number]; loading: boolean; delay: number }) {
  const display = useCountUp(kpi.value, { active: !loading, decimals: kpi.decimals ?? 0 })
  const Icon = KPI_ICONS[kpi.iconKey]
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/5 sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${TINT[kpi.tint]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="text-[12.5px] font-medium text-slate-500">{kpi.label}</span>
      </div>
      {loading ? (
        <Sk className="mt-3 h-7 w-20" />
      ) : (
        <div className="mt-2.5 flex flex-col gap-1.5">
          <div className="flex items-baseline gap-0.5">
            <b className="text-[24px] font-extrabold tabular-nums tracking-tight text-slate-900">{display}</b>
            <span className="text-[12px] font-medium text-slate-400">{kpi.unit}</span>
          </div>
          <div>
            {kpi.trend !== undefined ? (
              <TrendChip trend={kpi.trend} />
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {kpi.note}
              </span>
            )}
          </div>
        </div>
      )}
    </Reveal>
  )
}

/* ── 운영: 주문 관리 ─────────────────────────────────────────── */
function OrderCard({ loading, delay }: { loading: boolean; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const total = useCountUp(ORDER_TOTAL, { active: !loading })
  return (
    <DomainCard icon={<Package className="h-[18px] w-[18px]" />} title="주문 관리" to="/orders" tint="sky" delay={delay}>
      <div ref={ref}>
        <div className="flex flex-wrap items-baseline gap-1.5">
          <b className="text-[26px] font-extrabold tabular-nums text-slate-900">{loading ? '—' : total}</b>
          <span className="text-[13px] text-slate-400">건 · 전체 주문</span>
        </div>
        {/* stacked bar */}
        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          {ORDER_STATUS.map((s, i) => (
            <div
              key={s.label}
              className={`h-full ${inView && !loading ? 'is-visible' : ''} ${isFigma ? '!w-[var(--bar-w)] transition-none' : 'grow-bar'}`}
              style={{ '--bar-w': `${(s.count / ORDER_TOTAL) * 100}%`, '--reveal-delay': `${i * 60}ms`, background: s.color } as CSSProperties}
            />
          ))}
        </div>
        {/* legend */}
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {ORDER_STATUS.map((s) => (
            <li key={s.label} className="flex items-center gap-1.5 text-[12px]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 truncate text-slate-500">{s.label}</span>
              <b className="tabular-nums font-semibold text-slate-700">{s.count.toLocaleString()}</b>
            </li>
          ))}
        </ul>
      </div>
    </DomainCard>
  )
}

/* ── 운영: 배송 관리 ─────────────────────────────────────────── */
function DeliveryCard({ loading, delay }: { loading: boolean; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const stats = [
    { label: '배송 중', value: DELIVERY.inTransit, cls: 'text-sky-600' },
    { label: '완료', value: DELIVERY.completed, cls: 'text-emerald-600' },
    { label: '지연', value: DELIVERY.delayed, cls: 'text-rose-500' },
  ]
  return (
    <DomainCard icon={<Truck className="h-[18px] w-[18px]" />} title="배송 관리" to="/delivery" tint="indigo" delay={delay}>
      <div ref={ref} className="flex flex-1 flex-col">
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-3 text-center">
              {loading ? (
                <Sk className="mx-auto h-6 w-12" />
              ) : (
                <b className={`block text-[19px] font-extrabold tabular-nums ${s.cls}`}>{s.value.toLocaleString()}</b>
              )}
              <span className="mt-0.5 block text-[11px] text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-slate-500">정시 배송률</span>
            <b className="tabular-nums font-bold text-slate-900">{DELIVERY.onTimeRate}%</b>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 ${inView && !loading ? 'is-visible' : ''} ${isFigma ? '!w-[var(--bar-w)] transition-none' : 'grow-bar'}`}
              style={{ '--bar-w': `${DELIVERY.onTimeRate}%` } as CSSProperties}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">지연 {DELIVERY.delayed}건 · 기상 영향 모니터링 중</p>
        </div>
      </div>
    </DomainCard>
  )
}

/* ── 운영: 경로 최적화 ───────────────────────────────────────── */
function RouteCard({ loading, delay }: { loading: boolean; delay: number }) {
  return (
    <DomainCard icon={<Route className="h-[18px] w-[18px]" />} title="경로 최적화" to="/routes" tint="violet" delay={delay}>
      {loading ? (
        <Sk className="h-40 w-full" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            {ROUTE_METRICS.map((m) => (
              <div key={m.label} className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{m.label}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-bold ${m.trend < 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {m.trend < 0 ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                    {m.trend > 0 ? '+' : ''}
                    {m.trend}%
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-0.5">
                  <b className="text-[17px] font-extrabold tabular-nums text-slate-900">{m.value}</b>
                  <span className="text-[11px] text-slate-400">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-[11.5px] font-medium text-violet-700">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-violet-500 text-[10px] font-bold text-white">AI</span>
            <span className="leading-snug">AI 최적 경로로 운행 효율 23.7% 향상</span>
          </div>
        </>
      )}
    </DomainCard>
  )
}

/* ── 자원: 창고 관리 ─────────────────────────────────────────── */
function WarehouseCard({ loading, delay }: { loading: boolean; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <DomainCard
      icon={<Warehouse className="h-[18px] w-[18px]" />}
      title="창고 관리"
      to="/warehouses"
      tint="teal"
      delay={delay}
      className="lg:col-span-2"
    >
      {loading ? (
        <Sk className="h-40 w-full" />
      ) : (
        <div ref={ref} className="flex flex-1 flex-col">
          <ul className="space-y-3.5">
            {WAREHOUSES.map((w, i) => (
              <li key={w.name} className="flex items-center gap-3">
                <span className={`inline-flex w-11 shrink-0 justify-center rounded-md px-2 py-1 text-[11px] font-bold ${w.typeCls}`}>
                  {w.type}
                </span>
                <span className="w-16 shrink-0 text-[13px] font-semibold text-slate-700">{w.name}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 ${inView ? 'is-visible' : ''} ${isFigma ? '!w-[var(--bar-w)] transition-none' : 'grow-bar'}`}
                    style={{ '--bar-w': `${w.capacity}%`, '--reveal-delay': `${i * 120}ms` } as CSSProperties}
                  />
                </div>
                <b className="w-10 shrink-0 text-right text-[13px] font-bold tabular-nums text-slate-800">{w.capacity}%</b>
                <span className="inline-flex w-16 shrink-0 items-center justify-end gap-1 text-[12px] font-semibold tabular-nums text-sky-600">
                  <Thermometer className="h-3.5 w-3.5" />
                  {w.temp}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 pt-2.5 text-[12px] font-medium text-emerald-700">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span className="leading-snug">전체 창고 온도 정상 · 콜드체인 안정 유지 중</span>
          </div>
        </div>
      )}
    </DomainCard>
  )
}

/* ── 자원: 기사 관리 ─────────────────────────────────────────── */
function DriverCard({ loading, delay }: { loading: boolean; delay: number }) {
  const stats = [
    { label: '운행', value: DRIVERS.active, cls: 'text-emerald-600' },
    { label: '대기', value: DRIVERS.idle, cls: 'text-amber-500' },
    { label: '휴무', value: DRIVERS.off, cls: 'text-slate-400' },
  ]
  return (
    <DomainCard icon={<Users className="h-[18px] w-[18px]" />} title="기사 관리" to="/drivers" tint="amber" delay={delay}>
      {loading ? (
        <Sk className="h-44 w-full" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-2.5 text-center">
                <b className={`block text-[18px] font-extrabold tabular-nums ${s.cls}`}>{s.value}</b>
                <span className="text-[11px] text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold tracking-wide text-slate-400">우수 기사 TOP 3</span>
            <ul className="mt-2 space-y-1">
              {TOP_DRIVERS.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2 rounded-lg px-1 py-1">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      i === 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-[13px] font-medium text-slate-700">{d.name}</span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
                    <Star className="h-3 w-3" />
                    {d.rating}
                  </span>
                  <b className="w-9 text-right text-[12px] tabular-nums text-slate-500">{d.deliveries}건</b>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </DomainCard>
  )
}

/* ── 분석: 주간 입출고 추이 (그룹 막대) ──────────────────────── */
function WeeklyChart() {
  const max = 3200
  const base = 150
  const left = 24
  const right = 548
  const groupW = (right - left) / WEEKLY.length
  const barW = 10
  return (
    <svg viewBox="0 0 560 176" className="h-auto w-full" role="img" aria-label="주간 입고·출고 추이">
      {[150, 110, 70, 30].map((y, i) => (
        <g key={y}>
          <line x1={left} y1={y} x2={right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
          <text x={left - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize="9" fill="#cbd5e1">
            {[0, 1000, 2000, 3000][i]}
          </text>
        </g>
      ))}
      {WEEKLY.map((d, i) => {
        const cx = left + groupW * i + groupW / 2
        const inH = (d.inbound / max) * 120
        const outH = (d.outbound / max) * 120
        return (
          <g key={d.day}>
            <rect x={cx - barW - 1.5} y={base - inH} width={barW} height={inH} rx="3" fill="#0ea5e9" />
            <rect x={cx + 1.5} y={base - outH} width={barW} height={outH} rx="3" fill="#10b981" />
            <text x={cx} y={base + 15} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {d.day}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function AnalyticsCard({ loading, delay }: { loading: boolean; delay: number }) {
  return (
    <DomainCard
      icon={<BarChart className="h-[18px] w-[18px]" />}
      title="분석 리포트"
      to="/reports"
      tint="cyan"
      delay={delay}
      className="lg:col-span-2"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
            입고
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            출고
          </span>
        </div>
        <div className="flex gap-5">
          <div className="text-right">
            <span className="text-[11px] text-slate-400">주간 입고</span>
            <b className="block text-[15px] font-extrabold tabular-nums text-sky-600">{WEEK_INBOUND.toLocaleString()}</b>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">주간 출고</span>
            <b className="block text-[15px] font-extrabold tabular-nums text-emerald-600">{WEEK_OUTBOUND.toLocaleString()}</b>
          </div>
        </div>
      </div>
      <div className="mt-4">{loading ? <Sk className="h-[176px] w-full" /> : <WeeklyChart />}</div>
    </DomainCard>
  )
}

/* ── 시스템: 알림/메시지 ─────────────────────────────────────── */
const ALERT_ICONS = {
  temp: { icon: <CheckCircle className="h-4 w-4" />, cls: 'bg-emerald-50 text-emerald-600' },
  expiry: { icon: <TriangleAlert className="h-4 w-4" />, cls: 'bg-amber-50 text-amber-600' },
  delay: { icon: <Clock className="h-4 w-4" />, cls: 'bg-rose-50 text-rose-500' },
  stock: { icon: <Package className="h-4 w-4" />, cls: 'bg-violet-50 text-violet-600' },
} as const

function AlertsCard({ loading, delay }: { loading: boolean; delay: number }) {
  return (
    <DomainCard icon={<Bell className="h-[18px] w-[18px]" />} title="알림 / 메시지" to="/messages" tint="rose" delay={delay}>
      {loading ? (
        <Sk className="h-52 w-full" />
      ) : (
        <ul className="space-y-2.5">
          {ALERTS.map((a) => {
            const s = ALERT_ICONS[a.type]
            return (
              <li key={a.title} className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${s.cls}`}>{s.icon}</span>
                <div className="min-w-0 flex-1 leading-snug">
                  <b className="block truncate text-[13px] font-bold text-slate-800">{a.title}</b>
                  <span className="text-[11.5px] text-slate-500">{a.desc}</span>
                </div>
                <span className="shrink-0 text-[11px] text-slate-300">{a.time}</span>
              </li>
            )
          })}
        </ul>
      )}
    </DomainCard>
  )
}

/* ── 페이지 본체 ─────────────────────────────────────────────── */
const PERIODS = ['오늘', '이번 주', '이번 달'] as const

export default function DashboardPage() {
  const [loading, setLoading] = useState(!isFigma)
  const [refreshKey, setRefreshKey] = useState(0)
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('오늘')
  const [showBanner, setShowBanner] = useState(!isFigma)

  useEffect(() => {
    if (isFigma) return
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [refreshKey, isFigma])

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* demo notice */}
      {showBanner && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
          <span className="rounded-md bg-sky-500 px-2 py-0.5 text-[11px] font-extrabold text-white">DEMO</span>
          <p className="flex-1 text-[13px] text-sky-800">
            데모 환경입니다 — 표시되는 데이터는 예시이며 실제 물류 데이터와 무관합니다.
          </p>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="안내 닫기"
            className="shrink-0 rounded-lg px-2 py-1 text-[12px] font-semibold text-sky-500 transition-colors hover:bg-sky-100"
          >
            닫기
          </button>
        </div>
      )}

      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900">대시보드</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            주문부터 배송·창고·기사까지 전체 물류 현황을 한눈에 확인하세요 · 기준 2026-07-02 14:30
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* period segmented */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPeriod(p)
                  setRefreshKey((k) => k + 1)
                }}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  period === p ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            aria-label="데이터 새로고침"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* content — refreshKey로 리마운트해 카운트업·차트 재생 */}
      <div key={refreshKey}>
        {/* KPI strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
          {KPIS.map((k, i) => (
            <KpiTile key={k.key} kpi={k} loading={loading} delay={i * 60} />
          ))}
        </div>

        {/* 운영 */}
        <SectionLabel title="운영" desc="주문 · 배송 · 경로 최적화 현황" />
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <OrderCard loading={loading} delay={0} />
          <DeliveryCard loading={loading} delay={80} />
          <RouteCard loading={loading} delay={160} />
        </div>

        {/* 자원 */}
        <SectionLabel title="자원" desc="창고 가동률 · 기사 운영 현황" />
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <WarehouseCard loading={loading} delay={0} />
          <DriverCard loading={loading} delay={100} />
        </div>

        {/* 분석 · 시스템 */}
        <SectionLabel title="분석 · 시스템" desc="주간 물류 추이 · 실시간 알림" />
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <AnalyticsCard loading={loading} delay={0} />
          <AlertsCard loading={loading} delay={100} />
        </div>
      </div>
    </div>
  )
}
