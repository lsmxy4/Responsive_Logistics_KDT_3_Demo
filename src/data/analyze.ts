/** 분석 리포트 페이지(AnalyzePage) 전용 목업 데이터.
 *  주문 · 배송 · 창고 데이터를 분석 관점으로 재구성한 정적 데모 데이터다.
 *  상단 기간 탭(오늘 / 이번 주 / 이번 달)에 따라 모든 카드의 데이터가 함께 바뀌도록,
 *  기간별로 완전히 분리된 데이터셋(PeriodDataset)을 두고 있다. */

export type Tint = 'sky' | 'indigo' | 'emerald' | 'teal' | 'amber' | 'violet' | 'rose' | 'cyan'

export const ANALYZE_PERIODS = ['오늘', '이번 주', '이번 달'] as const
export type AnalyzePeriod = (typeof ANALYZE_PERIODS)[number]

/** 기간별 "전일/전주/전월 대비" 비교 문구 */
export const COMPARE_LABEL: Record<AnalyzePeriod, string> = {
  오늘: '전일 대비',
  '이번 주': '전주 대비',
  '이번 달': '전월 대비',
}

/* ══════════════════════════════ 상단 KPI ══════════════════════════════ */

export interface AnalyticsKpi {
  key: string
  label: string
  value: string
  unit?: string
  tint: Tint
  icon: 'check' | 'clock' | 'trend' | 'wallet'
  diff: string
  /** 증감의 좋고 나쁨(예: 운송비 상승은 상승이어도 부정적) — 색상 결정에 사용 */
  positive: boolean
}

/* ══════════════════════════════ 배송 추이 / 주문 분석 공용 x축 포인트 ══════════════════════════════ */

export interface TrendPoint {
  label: string
  value: number
}

export interface OrderAnalysisRow {
  label: string
  new: number
  done: number
  canceled: number
  returned: number
}

export const ORDER_ANALYSIS_LEGEND: { key: keyof Omit<OrderAnalysisRow, 'label'>; label: string; color: string }[] = [
  { key: 'new', label: '신규 주문', color: '#8b5cf6' },
  { key: 'done', label: '완료', color: '#3b82f6' },
  { key: 'canceled', label: '취소', color: '#f59e0b' },
  { key: 'returned', label: '반품', color: '#f43f5e' },
]

export interface RegionCount {
  region: string
  count: number
}

export interface HourlyPoint {
  hour: number
  count: number
}

export interface DonutSlice {
  label: string
  ratio: number
  color: string
  dot: string
}

export interface AiInsight {
  icon: 'trend' | 'clock' | 'map' | 'thermometer'
  title: string
}

export interface PeriodDataset {
  kpis: AnalyticsKpi[]
  deliveryTrend: TrendPoint[]
  orderAnalysis: OrderAnalysisRow[]
  regionTop5: RegionCount[]
  hourlyVolume: HourlyPoint[]
  donutTotal: number
  donut: DonutSlice[]
  aiInsights: AiInsight[]
}

/** 24시간 분포 형태(그래프 모양)는 기간에 상관없이 동일하게 두고, 규모(배수)만 다르게 스케일링한다. */
const HOURLY_SHAPE: number[] = [
  60, 40, 25, 20, 30, 60, 140, 260, 420, 560, 640, 700, 620, 680, 720, 760, 690, 610, 480, 340, 220, 140, 90, 60,
]

function scaleHourly(multiplier: number): HourlyPoint[] {
  return HOURLY_SHAPE.map((v, hour) => ({ hour, count: Math.round((v * multiplier) / 5) * 5 }))
}

/* ══════════════════════════════ 오늘 ══════════════════════════════ */

const TODAY: PeriodDataset = {
  kpis: [
    { key: 'successRate', label: '배송 성공률', value: '98.7', unit: '%', tint: 'emerald', icon: 'check', diff: '+1.8%', positive: true },
    { key: 'avgTime', label: '평균 배송시간', value: '4시간 21분', tint: 'sky', icon: 'clock', diff: '-18분', positive: true },
    { key: 'orderGrowth', label: '주문 증가율', value: '+12.3', unit: '%', tint: 'emerald', icon: 'trend', diff: '+2.1%', positive: true },
    { key: 'avgCost', label: '평균 운송비', value: '₩28,300', tint: 'amber', icon: 'wallet', diff: '+1,200원', positive: false },
  ],
  deliveryTrend: [
    { label: '00시', value: 320 },
    { label: '04시', value: 410 },
    { label: '08시', value: 980 },
    { label: '12시', value: 1620 },
    { label: '16시', value: 2150 },
    { label: '20시', value: 2480 },
    { label: '24시', value: 2650 },
  ],
  orderAnalysis: [
    { label: '00시', new: 60, done: 180, canceled: 20, returned: 10 },
    { label: '04시', new: 90, done: 220, canceled: 25, returned: 12 },
    { label: '08시', new: 220, done: 520, canceled: 60, returned: 30 },
    { label: '12시', new: 340, done: 780, canceled: 90, returned: 45 },
    { label: '16시', new: 410, done: 980, canceled: 110, returned: 55 },
    { label: '20시', new: 380, done: 1120, canceled: 130, returned: 60 },
    { label: '24시', new: 300, done: 1180, canceled: 140, returned: 65 },
  ],
  regionTop5: [
    { region: '경기', count: 420 },
    { region: '서울', count: 360 },
    { region: '부산', count: 210 },
    { region: '인천', count: 140 },
    { region: '대구', count: 95 },
  ],
  hourlyVolume: scaleHourly(1),
  donutTotal: 1850,
  donut: [
    { label: '배송 중', ratio: 58.0, color: '#3b82f6', dot: 'bg-sky-500' },
    { label: '완료', ratio: 35.0, color: '#10b981', dot: 'bg-emerald-500' },
    { label: '지연', ratio: 4.5, color: '#f59e0b', dot: 'bg-amber-500' },
    { label: '취소', ratio: 2.5, color: '#f43f5e', dot: 'bg-rose-500' },
  ],
  aiInsights: [
    { icon: 'trend', title: '수도권 주문량이 4% 증가했습니다' },
    { icon: 'clock', title: '평균 배송시간이 6분 단축되었습니다' },
    { icon: 'map', title: '부산 지역 배송량이 8% 증가했습니다' },
    { icon: 'thermometer', title: '냉장 물류 이용률이 2.1% 상승했습니다' },
  ],
}

/* ══════════════════════════════ 이번 주 ══════════════════════════════ */

const THIS_WEEK: PeriodDataset = {
  kpis: [
    { key: 'successRate', label: '배송 성공률', value: '97.9', unit: '%', tint: 'emerald', icon: 'check', diff: '+0.6%', positive: true },
    { key: 'avgTime', label: '평균 배송시간', value: '4시간 45분', tint: 'sky', icon: 'clock', diff: '-32분', positive: true },
    { key: 'orderGrowth', label: '주문 증가율', value: '+9.8', unit: '%', tint: 'emerald', icon: 'trend', diff: '+1.4%', positive: true },
    { key: 'avgCost', label: '평균 운송비', value: '₩27,850', tint: 'amber', icon: 'wallet', diff: '-450원', positive: true },
  ],
  deliveryTrend: [
    { label: '6/26', value: 4230 },
    { label: '6/27', value: 4850 },
    { label: '6/28', value: 5620 },
    { label: '6/29', value: 6340 },
    { label: '6/30', value: 7120 },
    { label: '7/1', value: 8010 },
    { label: '7/2', value: 8650 },
  ],
  orderAnalysis: [
    { label: '6/26', new: 2400, done: 4200, canceled: 900, returned: 500 },
    { label: '6/27', new: 2100, done: 3900, canceled: 850, returned: 450 },
    { label: '6/28', new: 2600, done: 4400, canceled: 950, returned: 480 },
    { label: '6/29', new: 2900, done: 4700, canceled: 900, returned: 500 },
    { label: '6/30', new: 3400, done: 5100, canceled: 1000, returned: 520 },
    { label: '7/1', new: 3200, done: 5300, canceled: 1050, returned: 540 },
    { label: '7/2', new: 3500, done: 5600, canceled: 1080, returned: 560 },
  ],
  regionTop5: [
    { region: '경기', count: 3250 },
    { region: '서울', count: 2480 },
    { region: '부산', count: 1620 },
    { region: '인천', count: 980 },
    { region: '대구', count: 780 },
  ],
  hourlyVolume: scaleHourly(6.5),
  donutTotal: 12530,
  donut: [
    { label: '배송 중', ratio: 54.2, color: '#3b82f6', dot: 'bg-sky-500' },
    { label: '완료', ratio: 38.6, color: '#10b981', dot: 'bg-emerald-500' },
    { label: '지연', ratio: 4.2, color: '#f59e0b', dot: 'bg-amber-500' },
    { label: '취소', ratio: 3.0, color: '#f43f5e', dot: 'bg-rose-500' },
  ],
  aiInsights: [
    { icon: 'trend', title: '수도권 주문량이 12% 증가했습니다' },
    { icon: 'clock', title: '평균 배송시간이 18분 단축되었습니다' },
    { icon: 'map', title: '부산 지역 배송량이 23% 증가했습니다' },
    { icon: 'thermometer', title: '냉장 물류 이용률이 8.7% 상승했습니다' },
  ],
}

/* ══════════════════════════════ 이번 달 ══════════════════════════════ */

const THIS_MONTH: PeriodDataset = {
  kpis: [
    { key: 'successRate', label: '배송 성공률', value: '96.4', unit: '%', tint: 'emerald', icon: 'check', diff: '-0.9%', positive: false },
    { key: 'avgTime', label: '평균 배송시간', value: '5시간 10분', tint: 'sky', icon: 'clock', diff: '+22분', positive: false },
    { key: 'orderGrowth', label: '주문 증가율', value: '+15.6', unit: '%', tint: 'emerald', icon: 'trend', diff: '+3.2%', positive: true },
    { key: 'avgCost', label: '평균 운송비', value: '₩29,100', tint: 'amber', icon: 'wallet', diff: '+800원', positive: false },
  ],
  deliveryTrend: [
    { label: '1주차', value: 18200 },
    { label: '2주차', value: 21400 },
    { label: '3주차', value: 24800 },
    { label: '4주차', value: 27600 },
    { label: '5주차', value: 31200 },
  ],
  orderAnalysis: [
    { label: '1주차', new: 8200, done: 14800, canceled: 1800, returned: 900 },
    { label: '2주차', new: 9400, done: 16800, canceled: 2000, returned: 980 },
    { label: '3주차', new: 10800, done: 19200, canceled: 2200, returned: 1050 },
    { label: '4주차', new: 11600, done: 21400, canceled: 2400, returned: 1120 },
    { label: '5주차', new: 12800, done: 24600, canceled: 2600, returned: 1200 },
  ],
  regionTop5: [
    { region: '경기', count: 13800 },
    { region: '서울', count: 10600 },
    { region: '부산', count: 6900 },
    { region: '인천', count: 4200 },
    { region: '대구', count: 3300 },
  ],
  hourlyVolume: scaleHourly(28),
  donutTotal: 52400,
  donut: [
    { label: '배송 중', ratio: 48.5, color: '#3b82f6', dot: 'bg-sky-500' },
    { label: '완료', ratio: 44.0, color: '#10b981', dot: 'bg-emerald-500' },
    { label: '지연', ratio: 4.0, color: '#f59e0b', dot: 'bg-amber-500' },
    { label: '취소', ratio: 3.5, color: '#f43f5e', dot: 'bg-rose-500' },
  ],
  aiInsights: [
    { icon: 'trend', title: '수도권 주문량이 21% 증가했습니다' },
    { icon: 'clock', title: '평균 배송시간이 42분 단축되었습니다' },
    { icon: 'map', title: '부산 지역 배송량이 31% 증가했습니다' },
    { icon: 'thermometer', title: '냉장 물류 이용률이 15.4% 상승했습니다' },
  ],
}

export const ANALYTICS_BY_PERIOD: Record<AnalyzePeriod, PeriodDataset> = {
  오늘: TODAY,
  '이번 주': THIS_WEEK,
  '이번 달': THIS_MONTH,
}
