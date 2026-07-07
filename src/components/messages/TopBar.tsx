import { Search, Snowflake } from 'lucide-react'

export default function TopBar({
  query,
  onQueryChange,
  mounted,
}: {
  query: string
  onQueryChange: (value: string) => void
  mounted: boolean
}) {
  return (
    <div
      className={`mb-6 flex items-center justify-between gap-3 transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-md shadow-sky-500/30">
          <Snowflake className="h-5 w-5" />
        </span>
        <span className="hidden text-sm font-bold tracking-tight text-slate-700 sm:block">Fresh Chain WMS</span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden max-w-xs flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="검색..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 pl-9 pr-3 text-sm text-slate-700 outline-none backdrop-blur transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </div>
    </div>
  )
}
