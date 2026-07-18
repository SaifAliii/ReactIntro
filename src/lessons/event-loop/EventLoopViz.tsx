import { AnimatePresence, motion } from 'framer-motion'
import { SyncOutlined } from '@ant-design/icons'
import type { ELState, Frame } from './steps'

const panelMeta = {
  stack: { title: 'Call Stack', color: 'var(--color-stack)', hint: 'LIFO' },
  webapi: { title: 'Web APIs', color: 'var(--color-webapi)', hint: 'browser' },
  micro: {
    title: 'Microtask Queue',
    color: 'var(--color-micro)',
    hint: 'Promises · high priority',
  },
  macro: {
    title: 'Macrotask Queue',
    color: 'var(--color-macro)',
    hint: 'setTimeout · events',
  },
} as const

function Token({ frame, color }: { frame: Frame; color: string }) {
  return (
    <motion.div
      layout
      layoutId={frame.id}
      initial={{ opacity: 0, scale: 0.7, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: 8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="break-words rounded-lg border px-2 py-1.5 font-mono text-[10.5px] text-[var(--color-ink)] sm:px-3 sm:py-2 sm:text-[12.5px]"
      style={{
        borderColor: color,
        background: `linear-gradient(color-mix(in srgb, ${color} 18%, var(--color-surface-2)), color-mix(in srgb, ${color} 18%, var(--color-surface-2)))`,
        boxShadow: `0 0 18px color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {frame.label}
    </motion.div>
  )
}

function Panel({
  kind,
  frames,
  reverse,
}: {
  kind: keyof typeof panelMeta
  frames: Frame[]
  /** stack grows upward, so render bottom-anchored */
  reverse?: boolean
}) {
  const meta = panelMeta[kind]
  return (
    <div className="flex min-h-[130px] min-w-0 flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-2.5 sm:min-h-[150px] sm:p-3">
      <div className="mb-2 flex items-center justify-between gap-1">
        <span
          className="text-[11px] font-bold uppercase tracking-wider sm:text-xs"
          style={{ color: meta.color }}
        >
          {meta.title}
        </span>
        <span className="hidden text-[10px] text-[var(--color-muted)] lg:inline">
          {meta.hint}
        </span>
      </div>
      <div
        className={`flex flex-1 flex-col gap-1.5 ${
          reverse ? 'justify-end' : 'justify-start'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {frames.map((fr) => (
            <Token key={fr.id} frame={fr} color={meta.color} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EventLoopBadge({ active }: { active?: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
      animate={{
        borderColor: active ? 'var(--color-ok)' : 'var(--color-border)',
        color: active ? 'var(--color-ok)' : 'var(--color-muted)',
      }}
    >
      <motion.span
        animate={{ rotate: active ? 360 : 0 }}
        transition={
          active
            ? { repeat: Infinity, duration: 1.1, ease: 'linear' }
            : { duration: 0.3 }
        }
        className="inline-flex"
      >
        <SyncOutlined />
      </motion.span>
      Event Loop {active ? 'running' : 'idle'}
    </motion.div>
  )
}

export default function EventLoopViz({ state }: { state: ELState }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <EventLoopBadge active={state.looping} />
        <span className="hidden text-xs text-[var(--color-muted)] sm:inline">
          microtasks drain fully before each macrotask
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-3">
        <Panel kind="stack" frames={state.stack} reverse />
        <Panel kind="webapi" frames={state.webapi} />
        <Panel kind="micro" frames={state.micro} />
        <Panel kind="macro" frames={state.macro} />
      </div>

      {/* Console output */}
      <div className="rounded-xl border border-[var(--color-border)] bg-black/40 p-3 font-mono text-[13px]">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
          Console
        </div>
        <div className="flex min-h-[24px] flex-col gap-0.5">
          <AnimatePresence initial={false}>
            {state.console.map((line, i) => (
              <motion.div
                key={`${line}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[var(--color-ok)]"
              >
                <span className="text-[var(--color-muted)]">›</span> {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
