import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { TABS } from '../../data/messages'

export default function FilterTabs({
  tab,
  onTabChange,
  unreadCount,
  // 기능 연결을 위해 새로운 Props 추가
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
}: {
  tab: string
  onTabChange: (key: string) => void
  unreadCount: number
  sortBy: 'latest' | 'oldest'
  onSortChange: (sort: 'latest' | 'oldest') => void
  statusFilter: 'all' | 'pending' | 'resolved'
  onStatusFilterChange: (status: 'all' | 'pending' | 'resolved') => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-20">
      {/* 왼쪽 카테고리 탭 영역 */}
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto rounded-xl bg-white/60 p-1.5 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`relative shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-slate-800'
            }`}
          >
            {t.label}
            {t.key === 'unread' && unreadCount > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab === t.key ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 오른쪽 정렬 및 세부 필터 (기능 활성화 완료) */}
      <div className="relative flex items-center justify-end gap-2">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex h-9 items-center gap-1.5 rounded-xl border bg-white/80 px-3.5 text-xs font-bold text-slate-600 backdrop-blur transition-all hover:bg-slate-50 ${
            dropdownOpen ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {sortBy === 'latest' ? '최신순' : '과거순'}
            {statusFilter !== 'all' && ` · ${statusFilter === 'pending' ? '미처리' : '처리완료'}`}
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 세부 정렬/필터 드롭다운 팝업 레이어 */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full z-[60] mt-1.5 w-48 origin-top-right rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl shadow-slate-900/10 animate-[pop_0.15s_ease-out]">
            {/* 정렬 그룹 */}
            <div className="mb-2">
              <p className="mb-1 px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">정렬 규칙</p>
              <button
                onClick={() => { onSortChange('latest'); setDropdownOpen(false); }}
                className={`w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold ${sortBy === 'latest' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                최신 등록순
              </button>
              <button
                onClick={() => { onSortChange('oldest'); setDropdownOpen(false); }}
                className={`w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold ${sortBy === 'oldest' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                오래된순
              </button>
            </div>

            <div className="h-px bg-slate-100 my-1.5" />

            {/* 처리 여부 필터 그룹 */}
            <div>
              <p className="mb-1 px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">처리 여부</p>
              {(['all', 'pending', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => { onStatusFilterChange(status); setDropdownOpen(false); }}
                  className={`w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold ${
                    statusFilter === status ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'all' ? '전체 보기' : status === 'pending' ? '미처리 알림만' : '처리완료 알림만'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
