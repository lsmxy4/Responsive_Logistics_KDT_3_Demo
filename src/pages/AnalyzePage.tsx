import { useState } from 'react'
import { RefreshCw } from '../components/icons'
import { ANALYZE_PERIODS, type AnalyzePeriod } from '../data/analyze'
import KpiSection from '../components/analyze/KpiSection'
import DeliveryTrendCard from '../components/analyze/DeliveryTrendCard'
import OrderAnalysisCard from '../components/analyze/OrderAnalysisCard'
import RegionTop5Card from '../components/analyze/RegionTop5Card'
import HourlyVolumeCard from '../components/analyze/HourlyVolumeCard'
import StatusDonutCard from '../components/analyze/StatusDonutCard'
import AiInsightCard from '../components/analyze/AiInsightCard'

/**
 * 분석 리포트 페이지: 주문 · 배송 · 창고 데이터를 분석하여 물류 효율을 확인하는 화면.
 *
 * 기간 관련 동작은 두 층으로 나뉜다.
 * 1) 평소에는 배송 추이 · 주문 분석 · 지역별 배송 TOP5 · 시간대별 배송량 · 배송 상태 분석 각 패널이
 *    자기 우측 드롭다운으로 완전히 독립적인 기간을 선택할 수 있다 (예: 배송 추이는 이번 달, 시간대별
 *    배송량은 오늘을 동시에 볼 수 있음).
 * 2) 다만 맨 위 제목 바로 아래에 있는 전체 기간 탭(오늘/이번 주/이번 달)을 누르면, 그 순간에는
 *    모든 패널의 개별 선택을 무시하고 선택한 기간으로 일괄 동기화된다. 이후에는 다시 각 패널을
 *    독립적으로 조작할 수 있고, 전체 탭을 또 누르면 다시 전부 그 기간으로 맞춰진다.
 *
 * 이 동기화는 `syncSignal`(전체 탭을 누를 때만 증가)로 구현한다 — 각 카드는 이 값이 바뀔 때만
 * 자신의 기간을 부모의 `period`로 강제로 맞추는 effect를 갖고, 그 외에는 자기 드롭다운으로
 * 자유롭게 기간을 바꿀 수 있다. `refreshSignal`은 새로고침 버튼 전용으로, 선택된 기간은 그대로
 * 두고 각 차트의 진입(로딩) 애니메이션만 다시 재생시킨다.
 */
export default function AnalyzePage() {
  const [period, setPeriod] = useState<AnalyzePeriod>('오늘')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [syncSignal, setSyncSignal] = useState(0)

  const changePeriod = (p: AnalyzePeriod) => {
    setPeriod(p)
    setSyncSignal((k) => k + 1)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setRefreshSignal((k) => k + 1)
    setTimeout(() => setRefreshing(false), 600)
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-[36px] font-black tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">분석</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Analytics
            </span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            주문, 배송, 창고 데이터를 분석하여 물류 효율을 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {ANALYZE_PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => changePeriod(p)}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  period === p ? 'bg-violet-500 text-white shadow-sm shadow-violet-500/25' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="데이터 새로고침"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <KpiSection key={`kpi-${period}-${refreshSignal}-${syncSignal}`} period={period} />

        <DeliveryTrendCard globalPeriod={period} syncSignal={syncSignal} refreshSignal={refreshSignal} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OrderAnalysisCard globalPeriod={period} syncSignal={syncSignal} refreshSignal={refreshSignal} />
          <RegionTop5Card globalPeriod={period} syncSignal={syncSignal} refreshSignal={refreshSignal} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <HourlyVolumeCard globalPeriod={period} syncSignal={syncSignal} refreshSignal={refreshSignal} />
          <StatusDonutCard globalPeriod={period} syncSignal={syncSignal} refreshSignal={refreshSignal} />
        </div>

        <AiInsightCard key={`ai-${period}-${refreshSignal}-${syncSignal}`} period={period} />
      </div>
    </div>
  )
}
