import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** delay in ms (use for staggering grids) */
  delay?: number
  /** vertical offset it slides up from, in px */
  y?: number
  /** wrapper tag */
  as?: ElementType
  /** once visible, stay visible (default true) */
  once?: boolean
}

// Fades + slides its children in when they scroll into view.
// Respects prefers-reduced-motion (shows immediately, no animation).
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  as: Tag = 'div',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once])

  const shown = visible || reduced

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: reduced
          ? undefined
          : `opacity .7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
