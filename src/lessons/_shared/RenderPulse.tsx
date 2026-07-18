import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

/** Counts how many times the calling component has rendered. */
export function useRenderCount() {
  const count = useRef(0)
  count.current += 1
  return count.current
}

interface Props {
  /** the current render count — changing it triggers a flash */
  count: number
  label?: string
  color?: string
}

/**
 * A small badge showing a render count that briefly flashes each time the
 * count increases — a visual "this component just re-rendered" indicator.
 */
export default function RenderPulse({
  count,
  label = 'renders',
  color = 'var(--color-brand)',
}: Props) {
  const controls = useAnimationControls()
  const prev = useRef(count)

  useEffect(() => {
    if (count !== prev.current) {
      controls.start({
        boxShadow: [
          `0 0 0px ${color}00`,
          `0 0 20px ${color}`,
          `0 0 0px ${color}00`,
        ],
        borderColor: [color, color, 'var(--color-border)'],
        transition: { duration: 0.7 },
      })
      prev.current = count
    }
  }, [count, color, controls])

  return (
    <motion.div
      animate={controls}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <span className="text-[var(--color-muted)]">{label}</span>
      <span
        className="font-mono text-base font-bold tabular-nums"
        style={{ color }}
      >
        {count}
      </span>
    </motion.div>
  )
}
