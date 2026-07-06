import { forwardRef, useMemo, useState } from 'react'
import Reveal from '../Reveal'
import { useInView } from '../../hooks/useInView'
import {
  Search,
  SlidersHorizontal,
  Plus,
  Download,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
} from '../icons'
import {
  ORDER_KPIS,
  ORDER_TABS,
  ORDERS,
  ORDER_STATUS_STYLE,
  ORDER_STATUS_DONUT,
  DAILY_ORDERS,
  TOP_CUSTOMERS,
  ORDER_LIST_PAGE_SIZE,
  type OrderTab,
} from '../../data/operate'
import { KpiTile, Panel, PageSectionHeader, VALUE_TINT } from './shared'

const KPI_ICON_TINT = ['sky', 'violet', 'amber', 'emerald', 'rose'] as const

/* ── 주문 상태별 현황: 도넛 차트 ─────────────────────────────── */
function OrderStatusDonut() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const total = ORDER_STATUS_DONUT.reduce((s, d) => s + d.count, 0)
  const r = 54
  const c = 2 * Math.PI * r
  let offsetAcc = 0

  return (
    <div ref={ref} className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {ORDER_STATUS_DONUT.map((d, i) => {
          const frac = d.count / total
          const dash = inView ? frac * c : 0
          const gap = c - dash
          const circle = (
            <circle
              key={d.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offsetAcc}
              style={{ transition: `stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms` }}
            />
          )
          offsetAcc += frac * c
          return circle
        })}
      </svg>
      <ul className="grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-1">
        {ORDER_STATUS_DONUT.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 truncate text-slate-500">{d.label}</span>
            <b className="tabular-nums font-semibold text-slate-700">{d.count.toLocaleString()}건</b>
            <span className="w-11 shrink-0 text-right text-[11px] text-slate-400">
              {((d.count / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 일별 주문 접수 현황: 라인 차트 ───────────────────────────── */
function DailyOrdersChart() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const w = 560
  const h = 176
  const left = 30
  const right = 546
  const top = 12
  const base = 150
  const max = 1000
  const step = (right - left) / (DAILY_ORDERS.length - 1)
  const peak = DAILY_ORDERS.reduce((m, d) => (d.count > m.count ? d : m), DAILY_ORDERS[0])

  const points = DAILY_ORDERS.map((d, i) => {
    const x = left + step * i
    const y = base - (d.count / max) * (base - top)
    return { x, y, d }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${path} L ${points[points.length - 1].x} ${base} L ${points[0].x} ${base} Z`

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="일별 주문 접수 현황">
        {[150, 112.5, 75, 37.5, 12].map((y, i) => (
          <g key={y}>
            <line x1={left} y1={y} x2={right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 4 ? '0' : '3 4'} />
            <text x={left - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize="9" fill="#cbd5e1">
              {[0, 250, 500, 750, 1000][4 - i]}
            </text>
          </g>
        ))}
        <defs>
          <linearGradient id="dailyOrdersFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#dailyOrdersFill)"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}
        />
        <path
          d={path}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          style={{
            strokeDasharray: 100,
            strokeDashoffset: inView ? 0 : 100,
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {points.map((p) => (
          <circle
            key={p.d.date}
            cx={p.x}
            cy={p.y}
            r={p.d.date === peak.date ? 0 : 3}
            fill="#0ea5e9"
            opacity={inView ? 1 : 0}
            style={{ transition: 'opacity 0.6s ease 0.9s' }}
          />
        ))}
        {points.map((p) => (
          <text key={`${p.d.date}-label`} x={p.x} y={base + 18} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {p.d.date}
          </text>
        ))}
        {/* peak callout */}
        {(() => {
          const p = points[points.length - 1]
          return (
            <g style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 1s' }}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
              <rect x={p.x - 44} y={p.y - 34} width="60" height="26" rx="7" fill="#0f172a" />
              <text x={p.x - 14} y={p.y - 24} textAnchor="middle" fontSize="9.5" fill="#93c5fd">
                {peak.date}
              </text>
              <text x={p.x - 14} y={p.y - 12} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">
                {peak.count}건
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

/* ── 주문 목록 테이블 ────────────────────────────────────────── */
function OrderTable({ rows }: { rows: typeof ORDERS }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-16 text-center">
        <Package className="h-8 w-8 text-slate-300" />
        <p className="text-[13px] text-slate-400">조건에 맞는 주문이 없습니다.</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
            <th className="whitespace-nowrap px-3 py-2.5">주문번호</th>
            <th className="whitespace-nowrap px-3 py-2.5">주문일시</th>
            <th className="whitespace-nowrap px-3 py-2.5">고객명</th>
            <th className="whitespace-nowrap px-3 py-2.5">수취인</th>
            <th className="whitespace-nowrap px-3 py-2.5">배송지</th>
            <th className="whitespace-nowrap px-3 py-2.5">주문 금액</th>
            <th className="whitespace-nowrap px-3 py-2.5">상태</th>
            <th className="whitespace-nowrap px-3 py-2.5 text-right">작업</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-slate-50 text-[13px] text-slate-600 transition-colors hover:bg-slate-50/70">
              <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">{o.id}</td>
              <td className="whitespace-nowrap px-3 py-3 text-slate-500">{o.placedAt}</td>
              <td className="whitespace-nowrap px-3 py-3">{o.customer}</td>
              <td className="whitespace-nowrap px-3 py-3">{o.receiver}</td>
              <td className="whitespace-nowrap px-3 py-3 text-slate-500">{o.address}</td>
              <td className="whitespace-nowrap px-3 py-3 font-semibold tabular-nums text-slate-800">
                {o.amount.toLocaleString()}원
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-bold ${ORDER_STATUS_STYLE[o.status]}`}>
                  {o.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-sky-600 transition-colors hover:bg-sky-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  상세 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 현재 페이지 주변만 보여주고 나머지는 …으로 줄인 페이지 번호 목록을 만든다. */
function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('ellipsis')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push('ellipsis')
  items.push(total)
  return items
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const items = getPageItems(page, totalPages)
  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-slate-300">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={page === p ? 'page' : undefined}
            className={`grid h-8 w-8 place-items-center rounded-lg text-[13px] font-semibold transition-colors ${
              page === p ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ── 섹션 본체 ───────────────────────────────────────────────── */
const OrderManagementSection = forwardRef<HTMLElement>((_props, ref) => {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<OrderTab>('전체')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      const matchesTab = tab === '전체' || o.status === tab
      const q = query.trim()
      const matchesQuery =
        q === '' || o.id.includes(q) || o.customer.includes(q) || o.receiver.includes(q)
      return matchesTab && matchesQuery
    })
  }, [tab, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ORDER_LIST_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * ORDER_LIST_PAGE_SIZE, safePage * ORDER_LIST_PAGE_SIZE)

  return (
    <section ref={ref} id="order-management" className="scroll-mt-20 lg:scroll-mt-8">
      <Reveal>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <PageSectionHeader title="주문 관리" desc="전체 주문 현황을 확인하고 관리할 수 있습니다." />
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="주문번호, 고객명, 수취인 검색"
                className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-[13px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              필터
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              신규 주문
            </button>
          </div>
        </div>
      </Reveal>

      {/* KPI */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {ORDER_KPIS.map((k, i) => (
          <KpiTile
            key={k.key}
            icon={<Package className="h-[18px] w-[18px]" />}
            label={k.label}
            value={k.value.toLocaleString()}
            unit={k.unit}
            tint={KPI_ICON_TINT[i]}
            delay={i * 60}
          />
        ))}
      </div>

      {/* 주문 목록 */}
      <Panel
        title="주문 목록"
        delay={120}
        className="mt-4"
        action={
          <div className="flex items-center gap-3">
            <span className="text-[12.5px] font-medium text-slate-400">
              총 <b className="font-bold text-slate-600">{filtered.length.toLocaleString()}</b>건
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12.5px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              엑셀 다운로드
            </button>
          </div>
        }
      >
        <div className="-mt-1 mb-4 flex flex-wrap gap-1.5 border-b border-slate-100 pb-4">
          {ORDER_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t)
                setPage(1)
              }}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                tab === t ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <OrderTable rows={pageRows} />
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </Panel>

      {/* 하단 3열 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="주문 상태별 현황" delay={0}>
          <OrderStatusDonut />
        </Panel>
        <Panel title="일별 주문 접수 현황" delay={80}>
          <DailyOrdersChart />
        </Panel>
        <Panel title="주문 상위 고객" delay={160}>
          <ul className="space-y-1">
            {TOP_CUSTOMERS.map((c) => (
              <li key={c.name} className="flex items-center gap-2.5 rounded-lg px-1 py-2">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    c.rank === 1 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {c.rank}
                </span>
                <span className="flex-1 truncate text-[13px] font-medium text-slate-700">{c.name}</span>
                <b className={`text-[13px] tabular-nums font-bold ${VALUE_TINT.sky}`}>{c.count.toLocaleString()}건</b>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  )
})

OrderManagementSection.displayName = 'OrderManagementSection'
export default OrderManagementSection
