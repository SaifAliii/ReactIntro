import { useMemo } from 'react'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import VTree, { type VNode } from '../_shared/VTree'

const jsx = `function Profile() {
  return (
    <div className="card">
      <h1>Ada Lovelace</h1>
      <p>Mathematician</p>
    </div>
  )
}`

const vdomObject = `// JSX is just sugar for React.createElement():
const vdom = {
  type: 'div',
  props: { className: 'card' },
  children: [
    { type: 'h1', props: {}, children: ['Ada Lovelace'] },
    { type: 'p',  props: {}, children: ['Mathematician'] },
  ],
}`

const steps = [
  { note: 'A component is just a function that returns JSX.', reveal: 0 },
  {
    note: 'The compiler turns each JSX tag into a plain JS object node.',
    reveal: 1,
  },
  { note: 'Children become nested objects — a whole tree in memory.', reveal: 2 },
  {
    note: 'This lightweight object tree is the Virtual DOM. No real DOM yet!',
    reveal: 3,
  },
]

function buildTree(reveal: number): VNode | null {
  if (reveal < 1) return null
  const children: VNode[] = []
  if (reveal >= 2)
    children.push({
      id: 'h1',
      tag: 'h1',
      text: '"Ada Lovelace"',
      status: reveal === 2 ? 'active' : 'same',
    })
  if (reveal >= 3)
    children.push({
      id: 'p',
      tag: 'p',
      text: '"Mathematician"',
      status: reveal === 3 ? 'active' : 'same',
    })
  return {
    id: 'div',
    tag: 'div',
    prop: 'className="card"',
    status: reveal === 1 ? 'active' : 'same',
    children,
  }
}

export default function VirtualDomLesson() {
  const player = useStepPlayer(steps.length, { interval: 1500 })
  // reveal grows monotonically as you step forward
  const reveal = Math.max(
    ...steps.slice(0, player.step + 1).map((s) => s.reveal),
  )
  const tree = useMemo(() => buildTree(reveal), [reveal])

  return (
    <LessonLayout slug="virtual-dom">
      <Section>
        <p>
          When you write JSX, the browser never sees it. A compiler (Babel or
          the TypeScript/SWC toolchain) rewrites every tag into a{' '}
          <code>React.createElement</code> call, which returns an ordinary{' '}
          <strong className="text-[var(--color-ink)]">JavaScript object</strong>
          . Nest those objects and you get a tree — the{' '}
          <strong className="text-[var(--color-ink)]">Virtual DOM</strong>: a
          cheap, in-memory description of what the UI should look like.
        </p>
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <CodeBlock code={jsx} />
          <CodeBlock code={vdomObject} language="js" />
        </div>
        <AnimationStage label="Virtual DOM tree" minH={360}>
          <div className="flex h-full items-center overflow-x-auto">
            <VTree root={tree} />
          </div>
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={steps.map((s) => s.note)} />

      <Callout kind="info" title="Why keep a copy in memory?">
        Touching the real DOM is slow. By building and comparing these
        lightweight objects first, React can figure out the <em>smallest</em>{' '}
        set of real DOM operations before it touches the page — which is exactly
        what the next lessons show.
      </Callout>
    </LessonLayout>
  )
}
