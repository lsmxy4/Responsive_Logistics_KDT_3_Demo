import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { CheckCircle, Lock, RefreshCw, Snowflake } from "../components/icons"
import { useInView } from "../hooks/useInView"
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

function MessageSection() {
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

type Tone = "sky" | "violet" | "emerald"

const toneClass: Record<Tone, { box: string; text: string }> = {
  sky: { box: "bg-sky-50 ring-sky-100", text: "text-sky-600" },
  violet: { box: "bg-violet-50 ring-violet-100", text: "text-violet-600" },
  emerald: { box: "bg-emerald-50 ring-emerald-100", text: "text-emerald-600" },
}

const settingsCards = [
  {
    title: "콜드체인 운영 기준",
    desc: "배송·창고 공통 온도 정책과 이탈 알림 기준을 설정합니다.",
    icon: Snowflake,
    tone: "sky" as const,
    rows: ["냉장 0~5℃", "냉동 -23~-18℃", "이탈 5분 지속 시 알림"],
  },
  {
    title: "권한 및 보안",
    desc: "관리자 승인, 세션 만료, 2단계 인증 정책을 관리합니다.",
    icon: Lock,
    tone: "violet" as const,
    rows: ["관리자 승인 사용", "세션 30분 유지", "중요 작업 2FA 필요"],
  },
  {
    title: "데이터 동기화",
    desc: "WMS·TMS 연동 주기와 실패 재시도 방식을 제어합니다.",
    icon: RefreshCw,
    tone: "emerald" as const,
    rows: ["실시간 주문 동기화", "GPS 30초 주기", "실패 시 3회 재시도"],
  },
]

const initialNotificationRules = [
  { label: "온도 이탈", channel: "앱 푸시 · SMS", enabled: true },
  { label: "배송 지연", channel: "앱 푸시", enabled: true },
  { label: "재고 부족", channel: "이메일 · 앱 푸시", enabled: true },
  { label: "야간 점검", channel: "이메일", enabled: false },
]

function ToggleButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-20 items-center justify-center rounded-full px-3 text-xs font-extrabold transition-colors ${
        enabled
          ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25 hover:bg-sky-600"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200"
      }`}
    >
      {enabled ? "ON" : "OFF"}
    </button>
  )
}

function SettingsSection() {
  const { ref: healthRef, inView: healthInView } = useInView<HTMLDivElement>()
  const [notificationRules, setNotificationRules] = useState(initialNotificationRules)

  const toggleNotificationRule = (label: string) => {
    setNotificationRules((rules) => rules.map((rule) => (rule.label === label ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 border-b border-slate-200/60 pb-6">
          <h1 className="flex items-center gap-3 text-[36px] font-black tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">설정</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Settings
            </span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            콜드체인 물류 운영 기준, 알림 정책, 권한 및 연동 상태를 한 화면에서 관리하세요.
          </p>
        </div>

        <section className="mt-8">
          <div>
            <p className="text-[14px] font-semibold text-slate-500">시스템 관리</p>
            <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-[28px] font-black tracking-tight text-slate-950">시스템 설정</h2>
                <p className="mt-2 text-[14px] font-medium leading-6 text-slate-500">
                  운영 기준과 자동화 정책을 운영/자원 페이지와 같은 카드형 화면에서 점검합니다.
                </p>
              </div>
              <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-600">
                <CheckCircle className="h-4 w-4" />
                변경 저장
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {settingsCards.map(({ title, desc, icon: Icon, tone, rows }) => {
              const colors = toneClass[tone]
              return (
                <article key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${colors.box} ${colors.text}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">{desc}</p>
                  <div className="mt-5 space-y-2">
                    {rows.map((row) => (
                      <div key={row} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {row}
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">Notification Rules</p>
                <h3 className="mt-2 text-xl font-black text-slate-950">알림 정책</h3>
              </div>
              <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50">
                새 규칙 추가
              </button>
            </div>
            <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200">
              {notificationRules.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                  <div>
                    <p className="font-extrabold text-slate-950">{rule.label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{rule.channel}</p>
                  </div>
                  <ToggleButton enabled={rule.enabled} onClick={() => toggleNotificationRule(rule.label)} />
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">System Health</p>
            <h3 className="mt-2 text-xl font-black text-slate-950">설정 점검 상태</h3>
            <div ref={healthRef} className="mt-6 space-y-4">
              {[
                ["보안 정책", "정상", "100%"],
                ["알림 수신", "3개 채널 연결", "86%"],
                ["연동 상태", "마지막 동기화 2분 전", "92%"],
              ].map(([label, caption, width], index) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-extrabold text-slate-700">
                    <span>{label}</span>
                    <span>{caption}</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/80">
                    <div
                      className={`grow-bar h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 ${healthInView ? "is-visible" : ""}`}
                      style={{ "--bar-w": width, "--reveal-delay": `${120 + index * 120}ms` } as CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default function System() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MessageSection />
      <SettingsSection />
    </div>
  )
}