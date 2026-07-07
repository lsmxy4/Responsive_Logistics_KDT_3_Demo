import { useEffect, useMemo, useState } from "react"
import {
  SEED,
  type NotificationAction,
  type NotificationItem,
  type SettingsState,
} from "../data/messages"
import TopBar from "../components/messages/TopBar"
import MessageHeader from "../components/messages/MessageHeader"
import KpiCards from "../components/messages/KpiCards"
import FilterTabs from "../components/messages/FilterTabs"
import NotificationList from "../components/messages/NotificationList"
import SettingsPanel from "../components/messages/SettingsPanel"
import Toast from "../components/messages/Toast"

// 페이지네이션 테스트용 대량 샘플 데이터
const LARGE_INITIAL_DATA: NotificationItem[] = [
  ...SEED,
  ...Array.from({ length: 80 }).map((_, index) => ({
    id: `generated-${index + 1}`,
    // 📦 삼항 연산자 결과 뒤에 as const를 명시하여 "today" | "earlier" 타입으로 확정합니다.
group: index % 2 === 0 ? ("today" as const) : ("earlier" as const),
    category: ["temp", "expiry", "stock", "system"][index % 4] as any,
    severity: ["info", "warning", "urgent"][index % 3] as any,
    icon: SEED[index % SEED.length]?.icon || SEED[0].icon,
    title: `📦 [테스트 데이터] 알림 항목 #${index + 1}`,
    desc: `페이지네이션 및 마지막 숫자 이동 로직 검증을 위한 대량 샘플 데이터입니다. (인덱스: ${index + 1})`,
    tag: index % 2 === 0 ? "WMS 실시간" : "시스템 보존",
    time: `${Math.floor(index / 2) + 1}시간 전`,
    unread: index % 3 === 0,
    resolved: index % 5 === 0,
    resolvedLabel: index % 5 === 0 ? "확인 완료" : undefined,
    actions: [{ key: "confirm", label: "확인", tone: "sky" }] as any,
  })),
]

export default function MessagePage() {
  const [items, setItems] = useState<NotificationItem[]>(LARGE_INITIAL_DATA)
  const [tab, setTab] = useState("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "resolved"
  >("all")

  const [settings, setSettings] = useState<SettingsState>({
    temp: true,
    expiry: true,
    stock: true,
    system: false,
    sound: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // 필터 조건 변경 시 페이지 번호 초기화
  useEffect(() => {
    setPage(1)
  }, [tab, query, severityFilter, sortBy, statusFilter])

  // 상단 카운트 지표 계산
  const totalCount = items.length
  const unreadCount = items.filter((i) => i.unread).length
  const urgentCount = items.filter(
    (i) => i.severity === "urgent" && !i.resolved,
  ).length
  const resolvedTodayCount = items.filter((i) => i.resolved).length + 34

  // 조건 필터링 및 정렬 처리
  const filtered = useMemo(() => {
    let result = [...items]

    result = result.filter((i) => {
      if (tab === "unread" && !i.unread) return false
      if (tab !== "all" && tab !== "unread" && i.category !== tab) return false
      if (severityFilter.size > 0 && !severityFilter.has(i.severity))
        return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        if (
          !i.title.toLowerCase().includes(q) &&
          !i.desc.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })

    if (statusFilter === "pending") result = result.filter((i) => !i.resolved)
    else if (statusFilter === "resolved")
      result = result.filter((i) => i.resolved)

    result.sort((a, b) =>
      sortBy === "latest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
    )
    return result
  }, [items, tab, query, severityFilter, sortBy, statusFilter])

  // 페이지네이션 처리
  const PAGE_SIZE = 8
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pagedItems = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    )
  }, [filtered, currentPage])

  const todayItems = pagedItems.filter((i) => i.group === "today")
  const earlierItems = pagedItems.filter((i) => i.group === "earlier")

  const allVisibleIds = pagedItems.map((i) => i.id)
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id))

  // --- 이벤트 핸들러 핸들링 ---
  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allSelected) allVisibleIds.forEach((id) => next.delete(id))
      else allVisibleIds.forEach((id) => next.add(id))
      return next
    })
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function deleteSelected() {
    if (selected.size === 0) return
    setItems((prev) => prev.filter((i) => !selected.has(i.id)))
    setSelected(new Set())
    setToast(`${selected.size}개의 알림을 삭제했습니다.`)
  }

  function markSelectedRead() {
    if (selected.size === 0) return
    setItems((prev) =>
      prev.map((i) => (selected.has(i.id) ? { ...i, unread: false } : i)),
    )
    setSelected(new Set())
    setToast(`${selected.size}개의 알림을 읽음 처리했습니다.`)
  }

  function markAllRead() {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })))
    setToast("모든 알림을 읽음으로 표시했습니다.")
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unread: false } : i)),
    )
  }

  function resolveAction(id: string, action: NotificationAction) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, unread: false, resolved: true, resolvedLabel: "확인 완료" }
          : i,
      ),
    )
    setToast(`처리되었습니다: ${action.label}`)
  }

  function toggleSetting(key: keyof SettingsState) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 mx-auto max-w-6xl">
        <TopBar
          query={query}
          onQueryChange={(val) => setQuery(val)}
          mounted={mounted}
        />

        <MessageHeader
          mounted={mounted}
          onMarkAllRead={markAllRead}
          filterOpen={filterOpen}
          onToggleFilter={() => setFilterOpen((v) => !v)}
          severityFilter={severityFilter}
          onToggleSeverity={(key) =>
            setSeverityFilter((prev) => {
              const n = new Set(prev);
              n.has(key) ? n.delete(key) : n.add(key);
              return n;
            })
          }
          onClearSeverity={() => setSeverityFilter(new Set())}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <KpiCards
          totalCount={totalCount}
          unreadCount={unreadCount}
          urgentCount={urgentCount}
          resolvedTodayCount={resolvedTodayCount}
          mounted={mounted}
        />

        <FilterTabs
          tab={tab}
          onTabChange={setTab}
          unreadCount={unreadCount}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* 심플 제어 컨트롤러 영역 (오른쪽 정렬 고정) */}
        <div className="mb-3 flex justify-end">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 p-1.5 px-3">
              <span className="text-xs font-medium text-sky-700">
                {selected.size}개 선택됨
              </span>
              <button
                onClick={markSelectedRead}
                className="rounded-lg bg-white border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100"
              >
                읽음 처리
              </button>
              <button
                onClick={deleteSelected}
                className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 shadow-sm"
              >
                선택 삭제
              </button>
            </div>
          )}
        </div>

        <NotificationList
          mounted={mounted}
          filteredCount={filtered.length}
          todayItems={todayItems}
          earlierItems={earlierItems}
          selected={selected}
          allSelected={allSelected}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelect={toggleSelect}
          onRead={markRead}
          onAction={resolveAction}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onToggle={toggleSetting}
        onClose={() => setSettingsOpen(false)}
        onSave={() => setSettingsOpen(false)}
      />
      <Toast message={toast} />
    </div>
  )
}
