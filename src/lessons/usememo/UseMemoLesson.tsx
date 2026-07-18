import { useMemo, useRef, useState } from 'react'
import { Button, InputNumber } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import RenderPulse, { useRenderCount } from '../_shared/RenderPulse'

// A deliberately slow computation so caching it clearly matters.
function slowFactorSum(n: number) {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= 20000; j++) {
      sum += (i * j) % 7
    }
  }
  return sum
}

export default function UseMemoLesson() {
  const renders = useRenderCount()
  const [n, setN] = useState(3)
  const [, setTick] = useState(0)

  // WITHOUT memo: recomputed on every single render.
  const noMemoCalls = useRef(0)
  noMemoCalls.current += 1
  slowFactorSum(n)

  // WITH memo: recomputed only when `n` changes.
  const memoCalls = useRef(0)
  const memoResult = useMemo(() => {
    memoCalls.current += 1
    return slowFactorSum(n)
  }, [n])

  return (
    <LessonLayout slug="usememo">
      <Section>
        <p>
          Where <code>useCallback</code> caches a <em>function</em>,{' '}
          <code>useMemo</code> caches a <em>value</em>. If a computation is
          expensive, you don&apos;t want to redo it on every render — only when
          its inputs change. <code>useMemo(() =&gt; compute(x), [x])</code>{' '}
          remembers the last result and returns it untouched until{' '}
          <code>x</code> changes.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-[var(--color-muted)]">Input n =</span>
        <InputNumber
          min={1}
          max={12}
          value={n}
          onChange={(v) => setN(v ?? 1)}
        />
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setTick((t) => t + 1)}
        >
          Re-render (unrelated state)
        </Button>
        <RenderPulse count={renders} label="component renders" />
      </div>

      <AnimationStage minH={220}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-[var(--color-warn)]/50 bg-[var(--color-warn)]/8 p-5">
            <div className="text-sm font-bold text-[var(--color-warn)]">
              Without useMemo
            </div>
            <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-[var(--color-ink)]">
              {noMemoCalls.current}
            </div>
            <div className="text-xs text-[var(--color-warn)]">
              times the slow function ran — climbs on <em>every</em> render,
              even unrelated ones
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl border border-[var(--color-ok)]/50 bg-[var(--color-ok)]/8 p-5">
            <div className="text-sm font-bold text-[var(--color-ok)]">
              With useMemo (deps: [n])
            </div>
            <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-[var(--color-ink)]">
              {memoCalls.current}
            </div>
            <div className="text-xs text-[var(--color-ok)]">
              only ran when <code>n</code> changed. Result:{' '}
              <span className="font-mono">{memoResult}</span>
            </div>
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title="Try it">
        Click <strong>Re-render (unrelated state)</strong> repeatedly: the left
        counter races ahead while the right one stays flat. Now change{' '}
        <strong>n</strong> — both tick up once, because the cached value&apos;s
        dependency actually changed.
      </Callout>

      <CodeBlock
        code={`// ❌ runs on every render
const total = slowFactorSum(n)

// ✅ runs only when n changes; otherwise returns the cached value
const total = useMemo(() => slowFactorSum(n), [n])`}
        language="js"
      />

      <Section title="Memo vs. Callback">
        <p>
          They&apos;re the same idea. In fact{' '}
          <code>useCallback(fn, deps)</code> is just{' '}
          <code>useMemo(() =&gt; fn, deps)</code>. Use <code>useMemo</code> for
          computed data (a filtered list, a derived object) and{' '}
          <code>useCallback</code> for the function you&apos;ll pass down.
        </p>
      </Section>
    </LessonLayout>
  )
}
