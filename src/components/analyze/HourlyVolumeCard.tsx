import { useEffect, useState } from 'react'
import { Clock } from '../icons'
import { useInView } from '../../hooks/useInView'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod, type HourlyPoint } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax, buildTicks, formatTick } from './chartUtils'

const LEFT = 30
const RIGHT = 380
const TOP = 12
const BASE = 150

/** 막대가 아래에서부터 자라나며 순서대로 등장하는 진입 애니메이션이 있는 차트 본체. */
function HourlyVolumeChart({ data }: { data: HourlyPoint[] }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const max = niceMax(Math.max(...data.map((d) => d.count)))
  const ticks = buildTicks(max, 4)
  const groupW = (RIGHT - LEFT) / data.length
  const barW = groupW * 0.6

  return (
    <div ref={ref}>
      <svg viewBox="0 0 400 180" className="h-auto w-full" role="img" aria-label="시간대별 배송량">
        {ticks.map((g, i) => {
          const y = BASE - (g / max) * (BASE - TOP)
          return (
            <g key={g}>
              <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
              <text x={LEFT - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize="9" fill="#cbd5e1">
                {formatTick(g)}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const cx = LEFT + groupW * i + groupW / 2
          const h = (d.count / max) * (BASE - TOP)
          return (
            <rect
              key={d.hour}
              x={cx - barW / 2}
              y={BASE - h}
              width={barW}
              height={h}
              rx="2"
              fill="#8b5cf6"
              fillOpacity={0.85}
              style={{
                transformOrigin: `${cx}px ${BASE}px`,
                transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.025}s`,
              }}
            />
          )
        })}
        {data.map(
          (d, i) =>
            d.hour % 4 === 0 && (
              <text
                key={`${d.hour}-lbl`}
                x={LEFT + groupW * i + groupW / 2}
                y={BASE + 14}
                textAnchor="middle"
                fontSize="9.5"
                fill="#94a3b8"
                style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${0.4 + i * 0.02}s` }}
              >
                {String(d.hour).padStart(2, '0')}시
              </text>
            ),
        )}
      </svg>
    </div>
  )
}

export default function HourlyVolumeCard({
  globalPeriod,
  syncSignal,
  refreshSignal,
}: {
  globalPeriod: AnalyzePeriod
  syncSignal: number
  refreshSignal: number
}) {
  const [period, setPeriod] = useState<AnalyzePeriod>(globalPeriod)

  useEffect(() => {
    setPeriod(globalPeriod)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncSignal])

  const data = ANALYTICS_BY_PERIOD[period].hourlyVolume

  return (
    <Panel
      title="시간대별 배송량"
      icon={<Clock className="h-[18px] w-[18px] text-violet-500" />}
      delay={80}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={setPeriod} />}
    >
      <HourlyVolumeChart key={`${period}-${refreshSignal}-${syncSignal}`} data={data} />
    </Panel>
  )
}
