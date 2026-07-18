import { useMemo } from 'react'
import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import T, { useT } from '@/i18n/T'
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

const reveals = [0, 1, 2, 3]

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
  const t = useT()
  const player = useStepPlayer(reveals.length, { interval: 1500 })
  // reveal grows monotonically as you step forward
  const reveal = Math.max(...reveals.slice(0, player.step + 1))
  const tree = useMemo(() => buildTree(reveal), [reveal])
  const stepLabels = t('lessons.virtual-dom.steps', {
    returnObjects: true,
  }) as string[]

  return (
    <LessonLayout slug="virtual-dom">
      <Section>
        <p>
          <T k="lessons.virtual-dom.intro" />
        </p>
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <CodeBlock code={jsx} />
          <CodeBlock code={vdomObject} language="js" />
        </div>
        <AnimationStage label={t('lessons.virtual-dom.stageLabel')} minH={360}>
          <div className="flex h-full items-center overflow-x-auto">
            <VTree root={tree} />
          </div>
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={stepLabels} />

      <Callout kind="info" title={t('lessons.virtual-dom.calloutTitle')}>
        <T k="lessons.virtual-dom.calloutBody" />
      </Callout>
    </LessonLayout>
  )
}
