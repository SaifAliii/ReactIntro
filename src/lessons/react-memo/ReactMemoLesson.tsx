import { memo, useState } from 'react'
import { Button } from 'antd'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import RenderPulse, { useRenderCount } from '../_shared/RenderPulse'

function PlainChild({ value }: { value: number }) {
  const renders = useRenderCount()
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-warn)]/50 bg-[var(--color-warn)]/8 p-5">
      <div className="text-sm font-bold text-[var(--color-warn)]">
        Plain child
      </div>
      <div className="text-xs text-[var(--color-muted)]">
        prop value = <span className="font-mono">{value}</span>
      </div>
      <RenderPulse count={renders} label="child renders" color="var(--color-warn)" />
      <div className="text-xs text-[var(--color-warn)]">
        re-renders whenever the parent does
      </div>
    </div>
  )
}

// Identical child, but wrapped in React.memo.
const MemoChild = memo(function MemoChild({ value }: { value: number }) {
  const renders = useRenderCount()
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-ok)]/50 bg-[var(--color-ok)]/8 p-5">
      <div className="text-sm font-bold text-[var(--color-ok)]">
        React.memo child
      </div>
      <div className="text-xs text-[var(--color-muted)]">
        prop value = <span className="font-mono">{value}</span>
      </div>
      <RenderPulse count={renders} label="child renders" color="var(--color-ok)" />
      <div className="text-xs text-[var(--color-ok)]">
        re-renders only when <code>value</code> changes
      </div>
    </div>
  )
})

export default function ReactMemoLesson() {
  const renders = useRenderCount()
  const [childValue, setChildValue] = useState(0)
  const [, setUnrelated] = useState(0)

  return (
    <LessonLayout slug="react-memo">
      <Section>
        <p>
          By default, when a component re-renders, <em>all</em> of its children
          re-render too — even if their props are identical.{' '}
          <code>React.memo(Component)</code> wraps a component so React first
          does a <strong className="text-[var(--color-ink)]">shallow compare
          of its props</strong>; if nothing changed, it reuses the previous
          result and skips rendering that subtree.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setUnrelated((n) => n + 1)}>
          Change unrelated parent state
        </Button>
        <Button type="primary" onClick={() => setChildValue((n) => n + 1)}>
          Change the child&apos;s prop (value +1)
        </Button>
        <RenderPulse count={renders} label="parent renders" />
      </div>

      <AnimationStage minH={240}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <PlainChild value={childValue} />
          <MemoChild value={childValue} />
        </div>
      </AnimationStage>

      <Callout kind="tip" title="Two buttons, two outcomes">
        <strong>Change unrelated parent state:</strong> the parent and the plain
        child re-render, but the memo child does not — its <code>value</code>{' '}
        prop is unchanged. <br />
        <strong>Change the child&apos;s prop:</strong> now <code>value</code>{' '}
        differs, so even the memo child re-renders. That&apos;s the point — it
        skips <em>unnecessary</em> renders, not necessary ones.
      </Callout>

      <CodeBlock
        code={`function Child({ value }) { /* ... */ }

// Only re-renders when \`value\` (shallow-compared) changes:
export default React.memo(Child)

// Need custom comparison? Pass a second arg:
React.memo(Child, (prev, next) => prev.value === next.value)`}
        language="tsx"
      />

      <Callout kind="warn" title="Gotcha: object & function props">
        <code>React.memo</code> compares props <em>shallowly</em>. If you pass a
        new object, array, or inline function each render, the memo &quot;breaks&quot;
        because the reference differs every time. That&apos;s exactly where{' '}
        <code>useMemo</code> and <code>useCallback</code> come in — they keep
        those references stable so <code>memo</code> can do its job.
      </Callout>
    </LessonLayout>
  )
}
