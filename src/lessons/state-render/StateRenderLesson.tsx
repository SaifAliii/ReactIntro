import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import RenderPulse, { useRenderCount } from '../_shared/RenderPulse'

const stages = [
  { key: 'trigger', title: '1 · Trigger', desc: 'setState is called' },
  { key: 'render', title: '2 · Render', desc: 'React calls your component' },
  { key: 'reconcile', title: '3 · Reconcile', desc: 'diff new vs old tree' },
  { key: 'commit', title: '4 · Commit', desc: 'apply changes to the DOM' },
]

/**
 * The stage animation lives in its OWN component so that its internal `active`
 * state changes don't re-render the parent. That keeps the parent's render
 * counter honest: exactly one re-render per setCount click.
 */
function Pipeline({ trigger }: { trigger: number }) {
  const [active, setActive] = useState(-1)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (trigger === 0) return // don't animate on the initial mount
    timers.current.forEach(clearTimeout)
    timers.current = []
    stages.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setActive(i), i * 420))
    })
    timers.current.push(
      window.setTimeout(() => setActive(-1), stages.length * 420 + 500),
    )
    return () => timers.current.forEach(clearTimeout)
  }, [trigger])

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
      {stages.map((s, i) => {
        const on = active === i
        const done = active > i || (active === -1 && trigger > 0)
        const color = on
          ? 'var(--color-brand)'
          : done
            ? 'var(--color-ok)'
            : 'var(--color-border)'
        return (
          <motion.div
            key={s.key}
            animate={{
              scale: on ? 1.05 : 1,
              borderColor: color,
              boxShadow: on
                ? '0 0 24px color-mix(in srgb, var(--color-brand) 45%, transparent)'
                : '0 0 0px transparent',
            }}
            className="rounded-xl border bg-[var(--color-surface)]/60 p-4"
          >
            <div
              className="text-sm font-bold"
              style={{ color: on ? 'var(--color-brand)' : 'var(--color-ink)' }}
            >
              {s.title}
            </div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">
              {s.desc}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function StateRenderLesson() {
  const renders = useRenderCount()
  const [count, setCount] = useState(0)

  return (
    <LessonLayout slug="state-render">
      <Section>
        <p>
          State is React&apos;s memory. When you call a state setter like{' '}
          <code>setCount</code>, you&apos;re not just changing a variable — you
          are{' '}
          <strong className="text-[var(--color-ink)]">
            scheduling a re-render
          </strong>
          . React then runs a four-stage pipeline to get that new state onto the
          screen.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCount((c) => c + 1)}
        >
          Call setCount({count} → {count + 1})
        </Button>
        <RenderPulse count={renders} label="component renders" />
        <div className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm">
          <span className="text-[var(--color-muted)]">count = </span>
          <span className="font-mono font-bold text-[var(--color-brand-2)]">
            {count}
          </span>
        </div>
      </div>

      <AnimationStage minH={220}>
        <div className="flex h-full items-center">
          <Pipeline trigger={count} />
        </div>
      </AnimationStage>

      <CodeBlock
        code={`const [count, setCount] = useState(0)

// This does NOT mutate a variable in place.
// It tells React: "the next render should see count + 1",
// then schedules that render.
setCount(count + 1)`}
        language="js"
      />

      <Callout kind="info" title="Renders are cheap; commits are targeted">
        The render counter climbs by exactly one per click — one{' '}
        <code>setCount</code> schedules one re-render of this component. (The
        four-stage animation runs inside a separate child component, so its own
        updates don&apos;t inflate the count.) Yet, as the previous lessons
        showed, React still only touches the single DOM text node that changed.
      </Callout>
    </LessonLayout>
  )
}
