import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Legend, LegendItem, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import EventLoopViz from './EventLoopViz'
import { eventLoopCode, eventLoopLabels, eventLoopSteps } from './steps'

export default function EventLoopLesson() {
  const player = useStepPlayer(eventLoopSteps.length, { interval: 1400 })
  const state = eventLoopSteps[player.step]

  return (
    <LessonLayout slug="event-loop">
      <Section>
        <p>
          JavaScript runs on a <strong>single thread</strong> — it can only do
          one thing at a time. So how does it handle timers, network calls and
          promises without freezing? The answer is the{' '}
          <strong className="text-[var(--color-ink)]">event loop</strong>: a
          coordinator that shuffles work between the call stack, the browser's
          Web APIs, and two queues.
        </p>
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <CodeBlock
            code={eventLoopCode}
            language="js"
            showLineNumbers
            highlightLines={state.line ? [state.line] : []}
          />
          <Legend>
            <LegendItem color="var(--color-stack)" label="Call stack" />
            <LegendItem color="var(--color-webapi)" label="Web APIs" />
            <LegendItem color="var(--color-micro)" label="Microtasks" />
            <LegendItem color="var(--color-macro)" label="Macrotasks" />
          </Legend>
        </div>

        <AnimationStage minH={470}>
          <EventLoopViz state={state} />
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={eventLoopLabels} />

      <Callout kind="tip" title="The one rule to remember">
        When the call stack is empty, the event loop first empties the{' '}
        <em>entire</em> microtask queue (Promise callbacks), and only then takes{' '}
        <em>one</em> macrotask (a <code>setTimeout</code>/event callback) — after
        which it drains microtasks again. That's why the output above is{' '}
        <code>1 → 4 → 3 → 2</code> even though the timeout was set to 0 ms.
      </Callout>

      <Section title="Why this matters in React">
        <p>
          React batches state updates and flushes effects around these same
          queues. Understanding micro- vs macro-tasks explains why a{' '}
          <code>setState</code> inside a promise behaves differently from one
          inside a <code>setTimeout</code>, and why{' '}
          <code>useLayoutEffect</code> can run before the browser ever paints.
        </p>
      </Section>
    </LessonLayout>
  )
}
