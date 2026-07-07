import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import type { NotificationItem, NotificationAction } from '../../data/messages'
import NotificationRow from './NotificationRow'

export default function NotificationList({
  mounted,
  filteredCount,
  todayItems,
  earlierItems,
  selected,
  allSelected,
  onToggleSelectAll,
  onToggleSelect,
  onRead,
  onAction,
  page,
  onPageChange,
  totalPages = 1, // 안전장치로 기본값 1 설정
}: {
  mounted: boolean
  filteredCount: number
  todayItems: NotificationItem[]
  earlierItems: NotificationItem[]
  selected: Set<string>
  allSelected: boolean
  onToggleSelectAll: () => void
  onToggleSelect: (id: string) => void
  onRead: (id: string) => void
  onAction: (id: string, action: NotificationAction) => void
  page: number
  onPageChange: (page: number) => void
  totalPages?: number
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-white bg-white/70 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
        {/* FIX: 전체 선택 체크박스 기능 연동 */}
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleSelectAll}
          className="h-4 w-4 cursor-pointer rounded accent-sky-500"
        />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          검색 결과 ({filteredCount}건)
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {/* 오늘 알림 */}
        {todayItems.length > 0 && (
          <div>
            <div className="bg-slate-50/50 px-4 py-2 text-xs font-bold text-slate-400 sm:px-6">오늘</div>
            <ul>
              {todayItems.map((item, idx) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  idx={idx}
                  selected={selected.has(item.id)}
                  onSelect={onToggleSelect}
                  onRead={onRead}
                  onAction={onAction}
                />
              ))}
            </ul>
          </div>
        )}

        {/* 이전 알림 */}
        {earlierItems.length > 0 && (
          <div>
            <div className="bg-slate-50/50 px-4 py-2 text-xs font-bold text-slate-400 sm:px-6">이전 알림</div>
            <ul>
              {earlierItems.map((item, idx) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  idx={idx + todayItems.length}
                  selected={selected.has(item.id)}
                  onSelect={onToggleSelect}
                  onRead={onRead}
                  onAction={onAction}
                />
              ))}
            </ul>
          </div>
        )}

        {/* 데이터가 없을 때 공백 예외 처리 */}
        {todayItems.length === 0 && earlierItems.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Bell className="mb-3 h-8 w-8 stroke-[1.5] text-slate-300" />
            <p className="text-sm font-medium">조건에 맞는 알림 내역이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 하단 페이지네이션 영역 기능 전체 연동 */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 sm:px-6">
        <span className="text-xs font-semibold text-slate-400">
          페이지 {page} / {totalPages}
        </span>
        <div className="flex items-center gap-1">
          {/* 이전 버튼 */}
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* dynamic 동적 숫자 버튼 처리 루프 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            // 무조건 다 보여주거나 데이터가 너무 많아지면 앞뒤 3개씩만 자르는 가드
            .filter((p) => totalPages <= 5 || Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
            .map((p, i, arr) => {
              // 중간에 생략 마크(...) 표시 로직
              const showEllipsis = i > 0 && p - arr[i - 1] > 1;
              return (
                <div key={p} className="flex items-center gap-1">
                  {showEllipsis && <span className="px-0.5 text-xs text-slate-400">…</span>}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold transition-colors ${
                      page === p ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                </div>
              );
            })}

          {/* 다음 버튼 */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
