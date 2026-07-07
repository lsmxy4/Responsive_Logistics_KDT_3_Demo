import { useEffect, useState } from 'react'
import { PieChart } from '../icons'
import { useInView } from '../../hooks/useInView'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod, type DonutSlice } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'

const SIZE = 176
const STROKE = 26
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

/** 각 구간이 정해진 시작 위치에서부터 순서대로 그려지는(스윕) 진입 애니메이션이 있는 도넛 본체. */
function StatusDonutChart({ total, slices }: { total: number; slices: DonutSlice[] }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  let offset = 0

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-44 w-44" role="img" aria-label="배송 상태 분석">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {slices.map((s, i) => {
            const len = (s.ratio / 100) * CIRC
            const startOffset = offset
            offset += len
            return (
              <circle
                key={s.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDashoffset={-startOffset}
                strokeLinecap="butt"
                style={{
                  strokeDasharray: inView ? `${len} ${CIRC - len}` : `0 ${CIRC}`,
                  transition: `stroke-dasharray 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`,
                }}
              />
            )
          })}
        </g>
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 8}
          textAnchor="middle"
          fontSize="11"
          fill="#94a3b8"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.5s' }}
        >
          전체
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 14}
          textAnchor="middle"
          fontSize="19"
          fontWeight="800"
          fill="#0f172a"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.55s' }}
        >
          {total.toLocaleString()}건
        </text>
      </svg>
    </div>
  )
}

export default function StatusDonutCard({
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

  const { donutTotal, donut } = ANALYTICS_BY_PERIOD[period]

  return (
    <Panel
      title="배송 상태 분석"
      icon={<PieChart className="h-[18px] w-[18px] text-sky-500" />}
      delay={160}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={setPeriod} />}
    >
      <div className="flex flex-1 flex-wrap items-center justify-center gap-6">
        <StatusDonutChart key={`${period}-${refreshSignal}-${syncSignal}`} total={donutTotal} slices={donut} />
        <ul className="flex flex-col gap-2.5">
          {donut.map((s) => (
            <li key={s.label} className="flex items-center gap-2.5 text-[13px]">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
              <span className="w-12 shrink-0 text-slate-500">{s.label}</span>
              <b className="tabular-nums font-bold text-slate-800">{s.ratio.toFixed(1)}%</b>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
