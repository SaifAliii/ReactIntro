import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** optional caption shown top-left */
  label?: string
  className?: string
  /** minimum height of the stage area */
  minH?: number
}

/**
 * A framed, subtly-gridded canvas that hosts a lesson's animation. Gives every
 * visualization a consistent bordered "stage" look.
 */
export default function AnimationStage({
  children,
  label,
  className = '',
  minH = 360,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 ${className}`}
      style={{ minHeight: minH }}
    >
      {/* faint dotted grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      {label && (
        <div className="absolute left-4 top-3 z-10 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </div>
      )}
      <div className={`relative z-[1] h-full p-4 ${label ? 'pt-9' : ''}`}>
        {children}
      </div>
    </div>
  )
}
