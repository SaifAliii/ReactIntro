import { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import RenderPulse, { useRenderCount } from '../_shared/RenderPulse'

export default function StateVsRefLesson() {
  const renders = useRenderCount()
  const [stateCount, setStateCount] = useState(0)
  const refCount = useRef(0)
  const [, forceRender] = useState(0)

  return (
    <LessonLayout slug="usestate-vs-useref">
      <Section>
        <p>
          Both <code>useState</code> and <code>useRef</code> let a component
          remember a value between renders. The difference is what happens when
          you change it: updating <strong className="text-[var(--color-ink)]">
          state re-renders</strong> the component, while mutating a{' '}
          <strong className="text-[var(--color-ink)]">ref does not</strong>. A
          ref is a plain, mutable box (<code>{'{ current }'}</code>) that
          survives renders without triggering them.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <RenderPulse count={renders} label="component renders" />
        <Button
          icon={<ReloadOutlined />}
          onClick={() => forceRender((n) => n + 1)}
        >
          Force a re-render
        </Button>
      </div>

      <AnimationStage minH={260}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          {/* useState card */}
          <div className="flex flex-col rounded-xl border border-[var(--color-brand)]/50 bg-[var(--color-brand)]/8 p-5">
            <div className="text-sm font-bold text-[var(--color-brand)]">
              useState
            </div>
            <div className="mt-2 font-mono text-5xl font-bold tabular-nums text-[var(--color-ink)]">
              {stateCount}
            </div>
            <div className="mt-1 text-xs text-[var(--color-ok)]">
              ▲ updating this re-renders → the UI always matches
            </div>
            <Button
              className="mt-auto"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setStateCount((c) => c + 1)}
            >
              setStateCount(+1)
            </Button>
          </div>

          {/* useRef card */}
          <div className="flex flex-col rounded-xl border border-[var(--color-webapi)]/50 bg-[var(--color-webapi)]/8 p-5">
            <div className="text-sm font-bold text-[var(--color-webapi)]">
              useRef
            </div>
            <div className="mt-2 font-mono text-5xl font-bold tabular-nums text-[var(--color-ink)]">
              {refCount.current}
            </div>
            <div className="mt-1 text-xs text-[var(--color-warn)]">
              ▲ this value is live in memory, but the screen only catches up on
              the next render
            </div>
            <Button
              className="mt-auto"
              icon={<PlusOutlined />}
              onClick={() => {
                refCount.current += 1
              }}
            >
              refCount.current++
            </Button>
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title="Try this">
        Click <strong>refCount.current++</strong> a few times — the big number
        won&apos;t move, because no render happened. Now click{' '}
        <strong>Force a re-render</strong> and the ref&apos;s real, accumulated
        value suddenly appears. The value was changing all along; React just had
        no reason to repaint.
      </Callout>

      <CodeBlock
        code={`const [stateCount, setStateCount] = useState(0)
const refCount = useRef(0)

setStateCount(c => c + 1) // ✅ schedules a re-render, UI updates
refCount.current += 1     // 🤫 mutates silently, no re-render`}
        language="js"
      />

      <Section title="When to reach for a ref">
        <p>
          Use a ref for values that shouldn&apos;t drive the UI: a DOM node (
          <code>ref={'{inputRef}'}</code>), a timer/interval id, the previous
          value of a prop, or any mutable bookkeeping. Use state whenever the
          value should be <em>shown</em> and kept in sync on screen.
        </p>
      </Section>
    </LessonLayout>
  )
}
