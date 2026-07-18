import { AnimatePresence, motion } from 'framer-motion'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import VTree, { type NodeStatus, type VNode } from '../_shared/VTree'

interface Step {
  note: string
  phase: 'idle' | 'render' | 'diff' | 'commit' | 'done'
  count: number
  /** status for the <p> node in the virtual tree */
  pStatus: NodeStatus
  /** is the real <p> node being mutated this step */
  commitP?: boolean
}

const steps: Step[] = [
  {
    note: 'Starting point: the Virtual DOM and the real DOM agree. Count is 0.',
    phase: 'idle',
    count: 0,
    pStatus: 'same',
  },
  {
    note: 'setCount(1) runs. React re-renders the component into a new tree.',
    phase: 'render',
    count: 1,
    pStatus: 'update',
  },
  {
    note: 'Diff (reconciliation): only the <p> text differs — everything else matches.',
    phase: 'diff',
    count: 1,
    pStatus: 'update',
  },
  {
    note: 'Commit: React runs ONE operation — p.textContent = "Count: 1".',
    phase: 'commit',
    count: 1,
    pStatus: 'update',
    commitP: true,
  },
  {
    note: 'Done. The <div>, <h1> and <button> DOM nodes were never touched.',
    phase: 'done',
    count: 1,
    pStatus: 'same',
  },
]

function vtree(step: Step): VNode {
  return {
    id: 'div',
    tag: 'div',
    prop: 'className="card"',
    children: [
      { id: 'h1', tag: 'h1', text: '"Counter"' },
      { id: 'p', tag: 'p', text: `"Count: ${step.count}"`, status: step.pStatus },
      { id: 'button', tag: 'button', text: '"+1"' },
    ],
  }
}

/** A browser-like rendering of the real DOM, flashing only the mutated node. */
function RealDom({ step }: { step: Step }) {
  const rows: { id: string; el: React.ReactNode; touched?: boolean }[] = [
    { id: 'h1', el: <span className="text-lg font-bold">Counter</span> },
    {
      id: 'p',
      el: <span>Count: {step.phase === 'idle' ? 0 : step.count}</span>,
      touched: step.commitP,
    },
    {
      id: 'button',
      el: (
        <span className="rounded-md bg-[var(--color-brand)] px-3 py-1 text-sm text-white">
          +1
        </span>
      ),
    },
  ]
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <div className="mb-3 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.id} className="relative">
            {r.touched && (
              <motion.span
                key={`flash-${step.phase}`}
                className="absolute -inset-1 rounded-md"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
                style={{ background: 'var(--color-ok)' }}
              />
            )}
            <div className="relative flex items-center gap-2 text-[var(--color-ink)]">
              {r.el}
              <AnimatePresence>
                {step.phase === 'done' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-semibold uppercase"
                    style={{
                      color: r.touched
                        ? 'var(--color-ok)'
                        : 'var(--color-muted)',
                    }}
                  >
                    {r.touched ? 'mutated' : 'untouched'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const phaseText: Record<Step['phase'], string> = {
  idle: 'Idle',
  render: 'Render phase',
  diff: 'Reconciliation',
  commit: 'Commit phase',
  done: 'Painted',
}

export default function CommitLesson() {
  const player = useStepPlayer(steps.length, { interval: 1700 })
  const step = steps[player.step]

  return (
    <LessonLayout slug="commit">
      <Section>
        <p>
          Diffing happens in the <strong>render phase</strong> and produces a
          list of changes — but nothing is on screen yet. In the{' '}
          <strong className="text-[var(--color-ink)]">commit phase</strong>{' '}
          React applies exactly those changes to the real DOM, and{' '}
          <strong className="text-[var(--color-ink)]">only</strong> those. A
          one-character text change becomes a single{' '}
          <code>textContent</code> assignment — not a rebuild of the card.
        </p>
      </Section>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Phase:
        </span>
        <span className="rounded-full border border-[var(--color-brand)]/50 bg-[var(--color-brand)]/15 px-3 py-1 text-sm font-semibold text-[var(--color-brand)]">
          {phaseText[step.phase]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimationStage label="Virtual DOM (new render)" minH={300}>
          <div className="flex h-full items-center overflow-x-auto">
            <VTree root={vtree(step)} />
          </div>
        </AnimationStage>
        <AnimationStage label="Real DOM (on the page)" minH={300}>
          <div className="flex h-full items-center justify-center">
            <RealDom step={step} />
          </div>
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={steps.map((s) => s.note)} />

      <CodeBlock
        code={`function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div className="card">
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}`}
      />

      <Callout kind="tip" title="Render ≠ DOM update">
        A component &quot;re-rendering&quot; only means React <em>called your
        function</em> and rebuilt a virtual tree. That&apos;s cheap. The
        expensive part — touching the DOM — is kept to the minimum diff. This is
        why unnecessary renders are usually fine, but not free (the next lessons
        show how to avoid them).
      </Callout>
    </LessonLayout>
  )
}
