import { useEffect, useRef, useState, type ReactNode } from 'react'
import Reveal from '../Reveal'
import { ChevronDown } from '../icons'
import type { Tint } from '../../data/analyze'

export const TINT: Record<Tint, string> = {
  sky: 'bg-sky-50 text-sky-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-500',
  cyan: 'bg-cyan-50 text-cyan-600',
}

/** 카드 컨테이너 (제목 + 우측 부가 컨트롤 슬롯) */
export function Panel({
  title,
  icon,
  action,
  delay = 0,
  className = '',
  children,
}: {
  title: string
  icon?: ReactNode
  action?: ReactNode
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <Reveal delay={delay} className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        </div>
        {action}
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </Reveal>
  )
}

/** 패널 우측 상단에 붙는 작은 기간 선택 드롭다운 (예: "이번 주") */
export function PeriodDropdown<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-2.5 text-[12.5px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        {value}
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute right-0 top-[calc(100%+6px)] z-10 min-w-[104px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`block w-full px-3 py-1.5 text-left text-[12.5px] font-medium transition-colors ${
                  opt === value ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
