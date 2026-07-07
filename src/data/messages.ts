import type { ComponentType } from "react"

import {
  Thermometer,
  CalendarClock,
  PackageSearch,
  PackageCheck,
  Truck,
  RefreshCw,
  Snowflake,
} from "lucide-react"

export type IconType = ComponentType<{ className?: string }>

export type NotificationAction = {
  key: "confirm" | "dismiss" | "ship" | "order"
  label: string
  tone: "rose" | "orange" | "amber" | "sky" | "ghost"
}

export type NotificationCategory = "temp" | "expiry" | "stock" | "system"
export type NotificationSeverity =
  | "urgent"
  | "warning"
  | "warning-amber"
  | "info"
  | "success"
  | "system"

export type NotificationItem = {
  id: string
  group: "today" | "earlier"
  category: NotificationCategory
  severity: NotificationSeverity
  icon: IconType
  title: string
  desc: string
  tag: string
  time: string
  unread: boolean
  resolved?: boolean
  resolvedLabel?: string
  actions?: NotificationAction[]
}

export type ToneStyle = {
  icon?: string
  badge?: string
  card?: string
  btn: string
  dot?: string
}

export type SettingsState = {
  temp: boolean
  expiry: boolean
  stock: boolean
  system: boolean
  sound: boolean
}

// ---------------------------------------------------------------------------
// Static seed data (mirrors the reference screenshot)
// ---------------------------------------------------------------------------
export const SEED: NotificationItem[] = [
  {
    id: "n1",
    group: "today",
    category: "temp",
    severity: "urgent",
    icon: Thermometer,
    title: "온도 이탈 감지 — 냉동창고 B동",
    desc: "냉동창고 B동의 현재 온도가 -12°C로 설정 범위(-20 ~ -15°C)를 초과했습니다. 즉시 확인이 필요합니다.",
    tag: "온도 알림",
    time: "방금 전",
    unread: true,
    actions: [
      { key: "confirm", label: "즉시 확인", tone: "rose" },
      { key: "dismiss", label: "무시", tone: "ghost" },
    ],
  },
  {
    id: "n2",
    group: "today",
    category: "expiry",
    severity: "warning",
    icon: CalendarClock,
    title: "유통기한 D-1 긴급 알림 — 냉동 참치 LOT#2847",
    desc: "냉동 참치 LOT#2847의 유통기한이 내일(2025-05-21) 만료됩니다. FEFO 출고 처리를 즉시 진행하세요.",
    tag: "유통기한",
    time: "5분 전",
    unread: true,
    actions: [
      { key: "ship", label: "출고 처리", tone: "orange" },
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
  {
    id: "n3",
    group: "today",
    category: "expiry",
    severity: "warning-amber",
    icon: CalendarClock,
    title: "유통기한 D-2 경고 — 냉장 우유 LOT#3142",
    desc: "냉장 우유 LOT#3142의 유통기한이 2일 후(2025-05-22) 만료됩니다. 출고 우선순위를 확인하세요.",
    tag: "유통기한",
    time: "12분 전",
    unread: true,
    actions: [
      { key: "ship", label: "출고 처리", tone: "amber" },
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
  {
    id: "n4",
    group: "today",
    category: "stock",
    severity: "info",
    icon: PackageSearch,
    title: "재고 부족 경고 — 냉장 연어 (LOT#2991)",
    desc: "냉장 연어의 현재 재고가 안전 재고(150건) 이하인 83건으로 감소했습니다. 발주를 검토하세요.",
    tag: "재고 알림",
    time: "28분 전",
    unread: true,
    actions: [
      { key: "order", label: "발주 검토", tone: "sky" },
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
  {
    id: "n5",
    group: "earlier",
    category: "stock",
    severity: "success",
    icon: PackageCheck,
    title: "입고 완료 — ORD-2024-00012530 (냉동 참치 200박스)",
    desc: "냉동 참치 200박스가 냉동창고 A동 3구역에 정상 입고 처리되었습니다. 담당자: 김철수",
    tag: "입고 완료",
    time: "어제 16:42",
    unread: false,
    resolved: true,
  },
  {
    id: "n6",
    group: "earlier",
    category: "stock",
    severity: "success",
    icon: Truck,
    title: "출고 완료 — TRK-2024-00012528 (냉장 우유 80박스)",
    desc: "냉장 우유 80박스가 부산물류터미널로 정상 출고 처리되었습니다. FEFO 기준 자동 선별 완료.",
    tag: "출고 완료",
    time: "어제 14:15",
    unread: false,
    resolved: true,
  },
  {
    id: "n7",
    group: "earlier",
    category: "system",
    severity: "system",
    icon: RefreshCw,
    title: "시스템 업데이트 완료 — v2.4.1 배포 완료",
    desc: "LogiFlow WMS v2.4.1이 성공적으로 배포되었습니다. 온도 센서 안정성 및 유통기한 알림 정확도가 개선되었습니다.",
    tag: "시스템",
    time: "어제 09:00",
    unread: false,
    resolved: true,
  },
  {
    id: "n8",
    group: "earlier",
    category: "temp",
    severity: "info",
    icon: Snowflake,
    title: "온도 정상 복귀 — 냉동창고 A동",
    desc: "냉동창고 A동의 온도가 정상 범위(0~5°C)로 복귀했습니다. 이탈 시간: 14:23 ~ 14:51 (약 28분)",
    tag: "온도 알림",
    time: "2일 전 14:51",
    unread: false,
    resolved: true,
  },
  {
    id: "n9",
    group: "today",
    category: "temp",
    severity: "info",
    icon: Thermometer,
    title: "온도 점검 완료 — 냉장창고 C동",
    desc: "냉장창고 C동의 온도가 정상 범위(2~5°C)로 유지되고 있습니다.",
    tag: "온도 알림",
    time: "40분 전",
    unread: false,
  },
  {
    id: "n10",
    group: "earlier",
    category: "expiry",
    severity: "warning",
    icon: CalendarClock,
    title: "유통기한 D-1 알림 — 냉장 치즈 LOT#5123",
    desc: "냉장 치즈 LOT#5123의 유통기한이 내일 만료됩니다.",
    tag: "유통기한",
    time: "어제 11:20",
    unread: true,
    actions: [
      { key: "ship", label: "출고 처리", tone: "orange" },
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
  {
    id: "n11",
    group: "today",
    category: "stock",
    severity: "warning-amber",
    icon: PackageSearch,
    title: "재고 부족 경고 — 냉동 닭고기 LOT#9981",
    desc: "냉동 닭고기 재고가 안전 재고 이하로 감소했습니다.",
    tag: "재고 알림",
    time: "1시간 전",
    unread: true,
    actions: [
      { key: "order", label: "발주 검토", tone: "amber" },
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
  {
    id: "n12",
    group: "earlier",
    category: "system",
    severity: "system",
    icon: RefreshCw,
    title: "시스템 점검 예정 — v2.4.2",
    desc: "내일 새벽 2시~4시 사이 시스템 점검이 예정되어 있습니다.",
    tag: "시스템",
    time: "어제 08:00",
    unread: true,
    actions: [
      { key: "confirm", label: "확인", tone: "ghost" },
    ],
  },
]

export const TABS: { key: string; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "unread", label: "읽지 않음" },
  { key: "temp", label: "온도 알림" },
  { key: "expiry", label: "유통기한" },
  { key: "stock", label: "재고" },
  { key: "system", label: "시스템" },
]

export const TONE: Record<string, ToneStyle> = {
  rose: {
    icon: "bg-gradient-to-br from-rose-500 to-rose-600",
    badge: "bg-rose-100 text-rose-600",
    card: "bg-rose-50/70 border-rose-100",
    btn: "bg-rose-500 hover:bg-rose-600 text-white",
    dot: "bg-rose-500",
  },
  orange: {
    icon: "bg-gradient-to-br from-orange-500 to-orange-600",
    badge: "bg-orange-100 text-orange-600",
    card: "bg-orange-50/70 border-orange-100",
    btn: "bg-orange-500 hover:bg-orange-600 text-white",
    dot: "bg-orange-500",
  },
  amber: {
    icon: "bg-gradient-to-br from-amber-500 to-amber-600",
    badge: "bg-amber-100 text-amber-700",
    card: "bg-amber-50/70 border-amber-100",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
    dot: "bg-amber-500",
  },
  sky: {
    icon: "bg-gradient-to-br from-sky-500 to-sky-600",
    badge: "bg-sky-100 text-sky-600",
    card: "bg-sky-50/70 border-sky-100",
    btn: "bg-sky-500 hover:bg-sky-600 text-white",
    dot: "bg-sky-500",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    badge: "bg-emerald-100 text-emerald-600",
    card: "bg-white border-slate-100",
    btn: "bg-emerald-500 hover:bg-emerald-600 text-white",
    dot: "bg-emerald-500",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-violet-600",
    badge: "bg-violet-100 text-violet-600",
    card: "bg-white border-slate-100",
    btn: "bg-violet-500 hover:bg-violet-600 text-white",
    dot: "bg-violet-500",
  },
  ghost: { btn: "bg-slate-100 hover:bg-slate-200 text-slate-500" },
}

export const SEVERITY_TONE: Record<string, string> = {
  urgent: "rose",
  warning: "orange",
  "warning-amber": "amber",
  info: "sky",
  success: "emerald",
  system: "violet",
}

export const SEVERITY_FILTER_OPTIONS: {
  key: string
  label: string
  tone: string
}[] = [
  { key: "urgent", label: "긴급", tone: "rose" },
  { key: "warning", label: "경고 (D-1)", tone: "orange" },
  { key: "warning-amber", label: "경고 (D-2)", tone: "amber" },
  { key: "info", label: "정보", tone: "sky" },
  { key: "success", label: "완료", tone: "emerald" },
  { key: "system", label: "시스템", tone: "violet" },
]

export const SETTINGS_OPTIONS: {
  key: keyof SettingsState;
  label: string;
  desc: string;
}[] = [
  {
    key: "temp",
    label: "온도 이탈 알림",
    desc: "설정 범위를 벗어나면 즉시 알림",
  },
  { key: "expiry", label: "유통기한 알림", desc: "D-2 시점부터 알림 발송" },
  {
    key: "stock",
    label: "재고 부족 알림",
    desc: "안전 재고 이하로 감소 시 알림",
  },
  { key: "system", label: "시스템 알림", desc: "배포 및 점검 소식 수신" },
  { key: "sound", label: "알림음", desc: "새 알림 도착 시 소리 재생" },
]
