import { useEffect, useRef, useState } from 'react'

interface Options {
  /** start the animation when true (e.g. when scrolled into view) */
  active: boolean
  duration?: number
  /** decimal places to keep */
  decimals?: number
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Count from 0 → `end` once `active` becomes true.
 * Returns a locale-formatted string (e.g. "12,530").
 */
export function useCountUp(end: number, { active, duration = 1400, decimals = 0 }: Options) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true

    if (typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.location.search.includes('figma=1'))) {
      setValue(end)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(end * easeOutExpo(progress))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, end, duration])

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
