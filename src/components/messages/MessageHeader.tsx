import { CheckCheck, Filter, Settings } from 'lucide-react'
import { SEVERITY_FILTER_OPTIONS, TONE } from '../../data/messages'

export default function MessageHeader({
  mounted,
  onMarkAllRead,
  filterOpen,
  onToggleFilter,
  severityFilter,
  onToggleSeverity,
  onClearSeverity,
  onOpenSettings,
}: {
  mounted: boolean
  onMarkAllRead: () => void
  filterOpen: boolean
  onToggleFilter: () => void
  severityFilter: Set<string>
  onToggleSeverity: (key: string) => void
  onClearSeverity: () => void
  onOpenSettings: () => void
}) {
  return (
    <div
      className={`relative z-[50] mb-6 flex flex-col gap-4 transition-all delay-75 duration-500 sm:flex-row sm:items-end sm:justify-between ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">알림 센터</h1>
        <p className="mt-1 text-sm text-slate-500">실시간 시스템 알림을 확인하고 관리할 수 있습니다.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onMarkAllRead}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm font-semibold text-slate-600 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-600 hover:shadow-md"
        >
          <CheckCheck className="h-4 w-4" /> 모두 읽음
        </button>

        <div className="relative">
          <button
            onClick={onToggleFilter}
            className={`flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md ${
              filterOpen
                ? 'border-sky-300 bg-sky-50 text-sky-600'
                : 'border-slate-200 bg-white/80 text-slate-600 hover:border-sky-200 hover:text-sky-600'
            }`}
          >
            <Filter className="h-4 w-4" /> 필터
          </button>
          
          {filterOpen && (
            /* FIX: 
              - 모바일(기본): left-0 right-auto로 설정하여 왼쪽 기준으로 카드가 열려 잘림 현상 방지
              - 데스크톱(sm:): sm:right-0 sm:left-auto로 변경하여 우측 정렬 유지
              - 모바일에서 부드럽게 열리도록 원점(origin)도 origin-top-left -> sm:origin-top-right로 대응
            */
            <div className="absolute left-0 right-auto sm:right-0 sm:left-auto z-[50] mt-2 w-56 origin-top-left sm:origin-top-right animate-[pop_0.15s_ease-out] rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/10">
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">심각도</p>
              {SEVERITY_FILTER_OPTIONS.map((s) => (
                <label
                  key={s.key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={severityFilter.has(s.key)}
                    onChange={() => onToggleSeverity(s.key)}
                    className="h-3.5 w-3.5 accent-sky-500"
                  />
                  <span className={`h-2 w-2 rounded-full ${TONE[s.tone].dot}`} />
                  {s.label}
                </label>
              ))}
              {severityFilter.size > 0 && (
                <button
                  onClick={onClearSeverity}
                  className="mt-1 w-full rounded-lg py-1.5 text-center text-xs font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  초기화
                </button>
              )}
              <style>{`@keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
            </div>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30"
        >
          <Settings className="h-4 w-4" /> 알림 설정
        </button>
      </div>
    </div>
  )
}
