/** 운영 페이지(OperatePage) 전용 목업 데이터 — 주문 관리 · 배송 관리 · 경로 최적화.
 *  대시보드 요약(dashboard.ts)과 별개로, 각 도메인 상세 화면에 필요한 형태로 정의한다. */

export type Tint = 'sky' | 'indigo' | 'emerald' | 'teal' | 'amber' | 'violet' | 'rose' | 'cyan'

/* ══════════════════════════════ 주문 관리 ══════════════════════════════ */

export interface OrderKpi {
  key: string
  label: string
  value: number
  unit: string
  tint: Tint
}

export const ORDER_KPIS: OrderKpi[] = [
  { key: 'total', label: '전체 주문', value: 12530, unit: '건', tint: 'sky' },
  { key: 'new', label: '신규 주문', value: 320, unit: '건', tint: 'violet' },
  { key: 'processing', label: '처리 중', value: 1245, unit: '건', tint: 'amber' },
  { key: 'done', label: '완료', value: 10965, unit: '건', tint: 'emerald' },
  { key: 'canceled', label: '취소/반품', value: 128, unit: '건', tint: 'rose' },
]

export const ORDER_TABS = ['전체', '신규 접수', '처리 중', '배송 준비', '배송 중', '완료', '취소/반품'] as const
export type OrderTab = (typeof ORDER_TABS)[number]

export type OrderStatus = '신규 접수' | '처리 중' | '배송 준비' | '배송 중' | '완료' | '취소/반품'

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  '신규 접수': 'bg-violet-50 text-violet-600',
  '처리 중': 'bg-amber-50 text-amber-600',
  '배송 준비': 'bg-orange-50 text-orange-600',
  '배송 중': 'bg-sky-50 text-sky-600',
  완료: 'bg-emerald-50 text-emerald-600',
  '취소/반품': 'bg-rose-50 text-rose-500',
}

export interface OrderRow {
  id: string
  placedAt: string
  customer: string
  receiver: string
  address: string
  amount: number
  status: OrderStatus
}

const CUSTOMER_POOL = [
  '(주)스마트테크',
  '(주)이레유통',
  '(주)비엔씨',
  '(주)아이로지스',
  '(주)엑스트솔루션',
  '(주)그린푸드',
  '(주)한빛물류',
  '(주)대성상사',
  '(주)유니온텍',
  '(주)케이앤라인',
  '(주)삼일유통',
  '(주)파인텍',
]
const RECEIVER_POOL = [
  '김지훈', '이서연', '박민수', '최유진', '장현우', '정다은', '오세훈', '한지민', '윤도현', '신유리', '조은서', '문성민',
]
const ADDRESS_POOL = [
  '부산광역시 강서구',
  '경기도 안산시',
  '대구광역시 북구',
  '광주광역시 광산구',
  '인천광역시 연수구',
  '서울특별시 강남구',
  '대전광역시 유성구',
  '울산광역시 남구',
  '경상남도 창원시',
  '전라북도 전주시',
  '충청남도 천안시',
  '강원특별자치도 원주시',
]
const STATUS_CYCLE: OrderStatus[] = ['배송 중', '처리 중', '완료', '신규 접수', '배송 중', '배송 준비', '완료', '취소/반품']

/** 화면 상단에 보이는 5건(레퍼런스 디자인)에 이어, 목록·페이지네이션이 실제로 동작하도록 목데이터를 더 생성한다. */
function buildOrders(): OrderRow[] {
  const featured: OrderRow[] = [
    {
      id: 'ORD-2024-00012530',
      placedAt: '2024-05-20 14:30',
      customer: '(주)스마트테크',
      receiver: '김지훈',
      address: '부산광역시 강서구',
      amount: 2350000,
      status: '배송 중',
    },
    {
      id: 'ORD-2024-00012529',
      placedAt: '2024-05-20 14:25',
      customer: '(주)이레유통',
      receiver: '이서연',
      address: '경기도 안산시',
      amount: 1850000,
      status: '처리 중',
    },
    {
      id: 'ORD-2024-00012528',
      placedAt: '2024-05-20 14:20',
      customer: '(주)비엔씨',
      receiver: '박민수',
      address: '대구광역시 북구',
      amount: 980000,
      status: '완료',
    },
    {
      id: 'ORD-2024-00012527',
      placedAt: '2024-05-20 14:15',
      customer: '(주)아이로지스',
      receiver: '최유진',
      address: '광주광역시 광산구',
      amount: 1250000,
      status: '신규 접수',
    },
    {
      id: 'ORD-2024-00012526',
      placedAt: '2024-05-20 14:10',
      customer: '(주)엑스트솔루션',
      receiver: '장현우',
      address: '인천광역시 연수구',
      amount: 3120000,
      status: '배송 중',
    },
  ]

  const generated: OrderRow[] = Array.from({ length: 55 }).map((_, i) => {
    const seq = 12525 - i
    const day = Math.max(1, 20 - Math.floor(i / 24))
    const hour = Math.max(0, 13 - Math.floor((i % 24) / 2))
    const minute = (55 - (i % 12) * 5 + 60) % 60
    return {
      id: `ORD-2024-000${seq}`,
      placedAt: `2024-05-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      customer: CUSTOMER_POOL[i % CUSTOMER_POOL.length],
      receiver: RECEIVER_POOL[i % RECEIVER_POOL.length],
      address: ADDRESS_POOL[i % ADDRESS_POOL.length],
      amount: 300000 + ((i * 137) % 28) * 100000,
      status: STATUS_CYCLE[i % STATUS_CYCLE.length],
    }
  })

  return [...featured, ...generated]
}

export const ORDERS: OrderRow[] = buildOrders()

export const ORDER_LIST_PAGE_SIZE = 8

export const ORDER_STATUS_DONUT: { label: string; count: number; color: string }[] = [
  { label: '신규 접수', count: 320, color: '#8b5cf6' },
  { label: '처리 중', count: 1245, color: '#3b82f6' },
  { label: '배송 준비', count: 2410, color: '#f59e0b' },
  { label: '배송 중', count: 6830, color: '#0ea5e9' },
  { label: '완료', count: 1587, color: '#10b981' },
  { label: '취소/반품', count: 128, color: '#f43f5e' },
]

export const DAILY_ORDERS: { date: string; count: number }[] = [
  { date: '05.14', count: 180 },
  { date: '05.15', count: 220 },
  { date: '05.16', count: 195 },
  { date: '05.17', count: 260 },
  { date: '05.18', count: 230 },
  { date: '05.19', count: 275 },
  { date: '05.20', count: 320 },
]

export const TOP_CUSTOMERS: { rank: number; name: string; count: number }[] = [
  { rank: 1, name: '(주)스마트테크', count: 2350 },
  { rank: 2, name: '(주)이레유통', count: 1850 },
  { rank: 3, name: '(주)비엔씨', count: 1420 },
  { rank: 4, name: '(주)아이로지스', count: 1250 },
  { rank: 5, name: '(주)엑스트솔루션', count: 980 },
]

/* ══════════════════════════════ 배송 관리 ══════════════════════════════ */

export interface DeliveryKpi {
  key: string
  label: string
  value: number
  unit: string
  tint: Tint
}

export const DELIVERY_KPIS: DeliveryKpi[] = [
  { key: 'total', label: '전체 배송', value: 12350, unit: '건', tint: 'sky' },
  { key: 'transit', label: '배송 중', value: 6850, unit: '건', tint: 'indigo' },
  { key: 'done', label: '배송 완료', value: 5350, unit: '건', tint: 'emerald' },
  { key: 'delayed', label: '지연 배송', value: 150, unit: '건', tint: 'rose' },
  { key: 'returned', label: '반품/회수', value: 120, unit: '건', tint: 'amber' },
]

export type DeliveryStatus = '배송 중' | '지연 배송' | '배송 완료'

export const DELIVERY_STATUS_STYLE: Record<DeliveryStatus, string> = {
  '배송 중': 'bg-sky-50 text-sky-600',
  '지연 배송': 'bg-rose-50 text-rose-500',
  '배송 완료': 'bg-emerald-50 text-emerald-600',
}

export interface DeliveryRow {
  id: string
  driver: string
  address: string
  status: DeliveryStatus
  eta: string
}

export const DELIVERIES: DeliveryRow[] = [
  { id: 'TRX-2024-00012530', driver: '김민수', address: '부산광역시 강서구', status: '배송 중', eta: '05-20 16:30' },
  { id: 'TRX-2024-00012529', driver: '이영훈', address: '경기도 안산시', status: '배송 중', eta: '05-20 17:15' },
  { id: 'TRX-2024-00012528', driver: '박지훈', address: '대구광역시 북구', status: '배송 중', eta: '05-20 15:45' },
  { id: 'TRX-2024-00012527', driver: '최민수', address: '광주광역시 광산구', status: '지연 배송', eta: '05-20 18:30' },
  { id: 'TRX-2024-00012526', driver: '정서인', address: '인천광역시 연수구', status: '배송 완료', eta: '05-20 14:20' },
]

export const DELIVERY_MAP_LEGEND = [
  { label: '배송 중', count: 6850, dot: 'bg-sky-500' },
  { label: '배송 완료', count: 5350, dot: 'bg-emerald-500' },
  { label: '지연 배송', count: 150, dot: 'bg-rose-500' },
]

export const DELIVERY_STATS: { label: string; value: string; diff: string; up: boolean }[] = [
  { label: '정시 배송률', value: '98.7%', diff: '+2.3%', up: true },
  { label: '평균 배송 시간', value: '12.5시간', diff: '-1.2시간', up: false },
  { label: '배송 중 지연률', value: '1.3%', diff: '-0.4%', up: false },
  { label: '고객 만족도', value: '4.8/5.0', diff: '+0.2', up: true },
]

/* ══════════════════════════════ 경로 최적화 ══════════════════════════════ */

export interface RouteKpi {
  key: string
  label: string
  value: string
  unit: string
  diff: string
  up: boolean
  tint: Tint
}

export const ROUTE_KPIS: RouteKpi[] = [
  { key: 'distance', label: '총 운행 거리', value: '12,850', unit: 'km', diff: '-8.5%', up: false, tint: 'sky' },
  { key: 'fuel', label: '연료 절감량', value: '2,340', unit: 'L', diff: '-5.2%', up: false, tint: 'emerald' },
  { key: 'time', label: '운행 시간 절약', value: '45.2', unit: '시간', diff: '-12.3%', up: false, tint: 'indigo' },
  { key: 'efficiency', label: '경로 효율성 향상', value: '23.7', unit: '%', diff: '+4.6%', up: true, tint: 'violet' },
]

export interface RecommendedRoute {
  id: number
  label: string
  stops: number
  distanceKm: number
  color: string
}

export const RECOMMENDED_ROUTES: RecommendedRoute[] = [
  { id: 1, label: '1차 경로', stops: 6, distanceKm: 125, color: '#0ea5e9' },
  { id: 2, label: '2차 경로', stops: 6, distanceKm: 98, color: '#10b981' },
  { id: 3, label: '3차 경로', stops: 5, distanceKm: 87, color: '#f59e0b' },
]

export interface RouteStop {
  order: number | 'start' | 'end'
  name: string
  address: string
  time: string
}

export interface RouteDetail {
  routeId: number
  stops: RouteStop[]
  totalDistanceKm: number
  estimatedTime: string
  deliveryCount: number
}

export const ROUTE_DETAILS: Record<number, RouteDetail> = {
  1: {
    routeId: 1,
    stops: [
      { order: 'start', name: '플러센터 A', address: '출발', time: '08:00' },
      { order: 1, name: '(주)스마트테크', address: '부산광역시 강서구', time: '09:30' },
      { order: 2, name: '(주)이레유통', address: '부산광역시 기장군', time: '11:15' },
      { order: 3, name: '(주)비엔씨', address: '부산광역시 기장군', time: '13:30' },
      { order: 4, name: '(주)아이로지스', address: '부산광역시 기장군', time: '15:00' },
      { order: 'end', name: '플러센터 A', address: '도착', time: '17:30' },
    ],
    totalDistanceKm: 125,
    estimatedTime: '9시간 30분',
    deliveryCount: 8,
  },
  2: {
    routeId: 2,
    stops: [
      { order: 'start', name: '플러센터 A', address: '출발', time: '08:00' },
      { order: 1, name: '(주)엑스트솔루션', address: '인천광역시 연수구', time: '09:45' },
      { order: 2, name: '(주)이레유통', address: '경기도 안산시', time: '11:30' },
      { order: 3, name: '(주)아이로지스', address: '광주광역시 광산구', time: '14:00' },
      { order: 'end', name: '플러센터 A', address: '도착', time: '16:20' },
    ],
    totalDistanceKm: 98,
    estimatedTime: '8시간 20분',
    deliveryCount: 6,
  },
  3: {
    routeId: 3,
    stops: [
      { order: 'start', name: '플러센터 A', address: '출발', time: '08:30' },
      { order: 1, name: '(주)비엔씨', address: '대구광역시 북구', time: '10:10' },
      { order: 2, name: '(주)스마트테크', address: '부산광역시 강서구', time: '12:40' },
      { order: 'end', name: '플러센터 A', address: '도착', time: '15:20' },
    ],
    totalDistanceKm: 87,
    estimatedTime: '6시간 50분',
    deliveryCount: 5,
  },
}

export const ROUTE_ANALYSIS_PERIODS = ['전체 기간', '이번 주', '이번 달'] as const

export const ROUTE_ANALYSIS: { axis: string; value: number }[] = [
  { axis: '거리 효율성', value: 85 },
  { axis: '시간 효율성', value: 78 },
  { axis: '연료 효율성', value: 82 },
  { axis: '고객 만족도', value: 90 },
  { axis: '적재 효율성', value: 75 },
]

export const ROUTE_IMPROVEMENTS: string[] = [
  '경로 순서 변경으로 15분 단축 가능',
  '고속도로 이용으로 12km 단축 가능',
  '적재량 최적화로 연료 5% 절감 가능',
]
