import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  /** stagger delay in ms */
  delay?: number
  /** 'up' = slide up + fade, 'zoom' = scale + fade */
  variant?: 'up' | 'zoom'
  className?: string
  as?: ElementType
  once?: boolean
}

/**
 * Wraps content and fades/slides it in the first time it enters the viewport.
 * Drives the page-wide scroll-reveal choreography.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
  as: Tag = 'div',
  once = true,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ once })
  const base = variant === 'zoom' ? 'reveal-zoom' : 'reveal'
  const Comp = Tag as ElementType
  const isFigma = typeof window !== 'undefined' && window.location.search.includes('figma=1')

  return (
    <Comp
      ref={ref}
      className={isFigma ? className : `${base} ${inView ? 'is-visible' : ''} ${className}`}
      style={isFigma ? {} : ({ '--reveal-delay': `${delay}ms` } as CSSProperties)}
    >
      {children}
    </Comp>
  )
}
