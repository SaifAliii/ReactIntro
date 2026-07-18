import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightOutlined } from '@ant-design/icons'
import { lessonGroups, lessons } from '@/lessons/registry'

const groupAccent: Record<string, string> = {
  JavaScript: 'var(--color-webapi)',
  'React Rendering': 'var(--color-brand)',
  'React Hooks': 'var(--color-brand-2)',
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center"
      >
        <div className="mb-3 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1 text-xs text-[var(--color-muted)]">
          Interactive · Animated · No fluff
        </div>
        <h1 className="m-0 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-brand-2)] to-[var(--color-ok)] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
          See how React really works
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)] md:text-lg">
          Watch the JavaScript event loop tick, virtual DOM trees diff, keys
          match up and hooks fire — all as step-by-step animations you control.
        </p>
        <div className="mt-6">
          <Link to={`/lesson/${lessons[0].slug}`}>
            <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-2.5 font-semibold text-white transition hover:brightness-110">
              Start with the Event Loop <ArrowRightOutlined />
            </span>
          </Link>
        </div>
      </motion.div>

      {lessonGroups.map((group) => (
        <section key={group} className="mb-10">
          <h2
            className="mb-4 text-sm font-bold uppercase tracking-widest"
            style={{ color: groupAccent[group] }}
          >
            {group}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons
              .filter((l) => l.group === group)
              .map((l, i) => (
                <motion.div
                  key={l.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    to={`/lesson/${l.slug}`}
                    className="group block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5 no-underline transition hover:-translate-y-0.5 hover:border-[var(--color-brand)]/60 hover:bg-[var(--color-surface-2)]/60"
                  >
                    <div
                      className="mb-3 h-1 w-10 rounded-full"
                      style={{ background: groupAccent[group] }}
                    />
                    <div className="text-lg font-semibold text-[var(--color-ink)]">
                      {l.title}
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {l.tagline}
                    </p>
                    <div className="mt-3 text-sm font-medium text-[var(--color-brand-2)] opacity-0 transition group-hover:opacity-100">
                      Open lesson <ArrowRightOutlined />
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
