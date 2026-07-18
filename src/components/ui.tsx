import type { ReactNode } from 'react'

/** A titled prose section within a lesson. */
export function Section({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section>
      {title && (
        <h2 className="mb-3 text-xl font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
      )}
      <div className="space-y-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
        {children}
      </div>
    </section>
  )
}

const calloutColors: Record<string, string> = {
  info: 'var(--color-brand-2)',
  tip: 'var(--color-ok)',
  warn: 'var(--color-warn)',
}

/** A left-accented callout box for key takeaways. */
export function Callout({
  kind = 'info',
  title,
  children,
}: {
  kind?: 'info' | 'tip' | 'warn'
  title?: string
  children: ReactNode
}) {
  const c = calloutColors[kind]
  return (
    <div
      className="rounded-lg border-l-4 bg-[var(--color-surface)]/50 px-4 py-3 text-[15px] text-[var(--color-ink)]"
      style={{ borderColor: c }}
    >
      {title && (
        <div className="mb-1 font-semibold" style={{ color: c }}>
          {title}
        </div>
      )}
      <div className="text-[var(--color-muted)]">{children}</div>
    </div>
  )
}

/** A colored legend row: swatch + label. */
export function LegendItem({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{ background: color, boxShadow: `0 0 10px ${color}66` }}
      />
      {label}
    </div>
  )
}

export function Legend({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">{children}</div>
  )
}
