import { useEffect, useState } from 'react'
import { TrendingUp } from '../icons'
import { useInView } from '../../hooks/useInView'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod, type TrendPoint } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax, buildTicks, formatTick } from './chartUtils'

const LEFT = 40
const RIGHT = 780
const TOP = 20
const BASE = 210

function toXY(i: number, value: number, count: number, max: number) {
  const step = (RIGHT - LEFT) / Math.max(1, count - 1)
  const x = LEFT + step * i
  const y = BASE - (value / max) * (BASE - TOP)
  return { x, y }
}

/** 처음 화면에 나타날 때 선이 그려지고 점이 순서대로 튀어나오는 진입 애니메이션이 있는 차트 본체.
 *  기간이 바뀌거나 새로고침될 때는 부모가 key를 바꿔 이 컴포넌트를 다시 마운트시켜 애니메이션을 재생한다. */
function DeliveryTrendChart({ data }: { data: TrendPoint[] }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const max = niceMax(Math.max(...data.map((d) => d.value)))
  const ticks = buildTicks(max)
  const points = data.map((d, i) => ({ ...d, ...toXY(i, d.value, data.length, max) }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${BASE} L ${points[0].x} ${BASE} Z`

  return (
    <div ref={ref}>
      <svg viewBox="0 0 820 250" className="h-auto w-full" role="img" aria-label="배송 추이">
        <defs>
          <linearGradient id="deliveryTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((g, i) => {
          const y = BASE - (g / max) * (BASE - TOP)
          return (
            <g key={g}>
              <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
              <text x={LEFT - 8} y={y} textAnchor="end" dominantBaseline="central" fontSize="10" fill="#94a3b8">
                {formatTick(g)}
              </text>
            </g>
          )
        })}

        <path
          d={areaPath}
          fill="url(#deliveryTrendFill)"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
            transitionDelay: '0.5s',
          }}
        />
        <path
          d={linePath}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: inView ? 0 : 1,
            transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {points.map((p, i) => (
          <g
            key={p.label}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.5s ease ${0.55 + i * 0.08}s, transform 0.5s ease ${0.55 + i * 0.08}s`,
            }}
          >
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#0ea5e9" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
              {p.value.toLocaleString()}
            </text>
            <text x={p.x} y={BASE + 22} textAnchor="middle" fontSize="10.5" fill="#94a3b8">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function DeliveryTrendCard({
  globalPeriod,
  syncSignal,
  refreshSignal,
}: {
  globalPeriod: AnalyzePeriod
  syncSignal: number
  refreshSignal: number
}) {
  const [period, setPeriod] = useState<AnalyzePeriod>(globalPeriod)

  // 상단 기간 탭을 누르면(syncSignal 변경) 이 패널의 개별 선택을 무시하고 전체 기간에 맞춘다.
  useEffect(() => {
    setPeriod(globalPeriod)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncSignal])

  const data = ANALYTICS_BY_PERIOD[period].deliveryTrend

  return (
    <Panel
      title="배송 추이"
      icon={<TrendingUp className="h-[18px] w-[18px] text-sky-500" />}
      delay={0}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={setPeriod} />}
    >
      <div className="mt-1">
        <DeliveryTrendChart key={`${period}-${refreshSignal}-${syncSignal}`} data={data} />
      </div>
    </Panel>
  )
}
