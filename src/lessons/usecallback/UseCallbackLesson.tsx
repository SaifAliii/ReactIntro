import { memo, useCallback, useRef, useState } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import RenderPulse, { useRenderCount } from '../_shared/RenderPulse'

interface ChildProps {
  title: string
  onAction: () => void
  color: string
}

// Wrapped in React.memo so it only re-renders when its props actually change.
const MemoChild = memo(function MemoChild({ title, color }: ChildProps) {
  const renders = useRenderCount()
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-4"
      style={{ borderColor: `${color}66` }}
    >
      <div className="text-sm font-bold" style={{ color }}>
        {title}
      </div>
      <RenderPulse count={renders} label="child renders" color={color} />
    </div>
  )
})

export default function UseCallbackLesson() {
  const [, setTick] = useState(0)

  // Recreated on every render → a brand-new function identity each time.
  const unstable = () => {}
  // Memoized → the exact same function reference across renders.
  const stable = useCallback(() => {}, [])

  // Track how often each identity actually changes.
  const unstableId = useRef(0)
  const prevUnstable = useRef<() => void>(unstable)
  if (prevUnstable.current !== unstable) {
    unstableId.current += 1
    prevUnstable.current = unstable
  }
  const stableId = useRef(0)
  const prevStable = useRef<() => void>(stable)
  if (prevStable.current !== stable) {
    stableId.current += 1
    prevStable.current = stable
  }

  return (
    <LessonLayout slug="usecallback">
      <Section>
        <p>
          Every render creates fresh function objects. Usually that&apos;s
          harmless — but if you pass a function as a prop to a{' '}
          <code>React.memo</code> child, a new function each render looks like a{' '}
          <em>changed prop</em>, so the child re-renders anyway.{' '}
          <code>useCallback(fn, deps)</code> hands you back the{' '}
          <strong className="text-[var(--color-ink)]">same function
          reference</strong> until a dependency changes.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setTick((t) => t + 1)}
        >
          Re-render the parent
        </Button>
        <span className="text-sm text-[var(--color-muted)]">
          Each click re-renders the parent. Watch which child follows along.
        </span>
      </div>

      <AnimationStage minH={230}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[var(--color-muted)]">
              handler identity id:{' '}
              <span className="font-mono font-bold text-[var(--color-warn)]">
                #{unstableId.current}
              </span>{' '}
              (changes every render)
            </div>
            <MemoChild
              title="Child with plain function prop"
              onAction={unstable}
              color="var(--color-warn)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[var(--color-muted)]">
              handler identity id:{' '}
              <span className="font-mono font-bold text-[var(--color-ok)]">
                #{stableId.current}
              </span>{' '}
              (stable)
            </div>
            <MemoChild
              title="Child with useCallback prop"
              onAction={stable}
              color="var(--color-ok)"
            />
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title="What you should see">
        The left child&apos;s render count climbs with every parent render — its
        function prop is different each time. The right child stays put:{' '}
        <code>useCallback</code> kept the reference identical, so{' '}
        <code>React.memo</code> could skip it.
      </Callout>

      <CodeBlock
        code={`// ❌ new function every render → memo child re-renders
const handleClick = () => doThing(id)

// ✅ same function until \`id\` changes → memo child can skip
const handleClick = useCallback(() => doThing(id), [id])

<MemoChild onClick={handleClick} />`}
        language="tsx"
      />

      <Callout kind="warn" title="Don't sprinkle it everywhere">
        <code>useCallback</code> only pays off when the function is a dependency
        of something (a <code>memo</code> child, a <code>useEffect</code>, or
        another hook). Wrapping every handler adds memory and complexity for no
        benefit. Measure first.
      </Callout>
    </LessonLayout>
  )
}
