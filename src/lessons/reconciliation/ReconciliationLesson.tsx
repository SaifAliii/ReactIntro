import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import { Callout, Legend, LegendItem, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import VTree, { statusColor, type NodeStatus, type VNode } from '../_shared/VTree'

interface Step {
  note: string
  /** which node id is being compared right now */
  active?: string
  /** final diff status per new-tree node id */
  newStatus: Record<string, NodeStatus>
}

const steps: Step[] = [
  {
    note: 'React holds the previous tree and compares it against the freshly rendered one.',
    newStatus: {},
  },
  {
    note: 'Compare the roots: <ul> vs <ul> — same type, so reuse the node.',
    active: 'ul',
    newStatus: {},
  },
  {
    note: 'Child 1: <li>Buy milk</li> is identical in both. Nothing to do.',
    active: 'li1',
    newStatus: {},
  },
  {
    note: 'Child 2: same <li>, but the text changed "dog" → "cat". Patch the text.',
    active: 'li2',
    newStatus: { li2: 'update' },
  },
  {
    note: 'Child 3: <li>Read book</li> exists only in the new tree → insert it.',
    active: 'li3',
    newStatus: { li2: 'update', li3: 'add' },
  },
  {
    note: 'Done. From a whole re-render React derived just 1 text patch + 1 insert.',
    newStatus: { li2: 'update', li3: 'add' },
  },
]

const oldTree: VNode = {
  id: 'ul',
  tag: 'ul',
  children: [
    { id: 'li1', tag: 'li', text: '"Buy milk"' },
    { id: 'li2', tag: 'li', text: '"Walk dog"' },
  ],
}

function newTree(step: Step): VNode {
  const s = (id: string): NodeStatus =>
    step.active === id ? 'active' : (step.newStatus[id] ?? 'same')
  return {
    id: 'ul',
    tag: 'ul',
    status: s('ul'),
    children: [
      { id: 'li1', tag: 'li', text: '"Buy milk"', status: s('li1') },
      { id: 'li2', tag: 'li', text: '"Walk cat"', status: s('li2') },
      ...(step.newStatus.li3 || step.active === 'li3'
        ? [
            {
              id: 'li3',
              tag: 'li',
              text: '"Read book"',
              status: s('li3'),
            } as VNode,
          ]
        : []),
    ],
  }
}

function oldWithActive(active?: string): VNode {
  const mark = (n: VNode): VNode => ({
    ...n,
    status: active === n.id ? 'active' : 'same',
    children: n.children?.map(mark),
  })
  return mark(oldTree)
}

export default function ReconciliationLesson() {
  const player = useStepPlayer(steps.length, { interval: 1800 })
  const step = steps[player.step]

  return (
    <LessonLayout slug="reconciliation">
      <Section>
        <p>
          On every render React produces a brand-new Virtual DOM tree. Instead
          of throwing away the page and rebuilding it, it{' '}
          <strong className="text-[var(--color-ink)]">diffs</strong> the new
          tree against the previous one. This comparison — called{' '}
          <strong className="text-[var(--color-ink)]">reconciliation</strong> —
          walks both trees together and records the minimal list of changes.
        </p>
      </Section>

      <AnimationStage minH={340}>
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="overflow-x-auto border-b border-[var(--color-border)] pb-4 sm:border-b-0 sm:pb-0">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Previous tree
            </div>
            <VTree root={oldWithActive(step.active)} />
          </div>
          <div className="overflow-x-auto sm:border-l sm:border-[var(--color-border)] sm:pl-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              New tree
            </div>
            <VTree root={newTree(step)} />
          </div>
        </div>
      </AnimationStage>

      <Legend>
        <LegendItem color={statusColor.active} label="Comparing now" />
        <LegendItem color={statusColor.update} label="Text/props changed" />
        <LegendItem color={statusColor.add} label="Inserted" />
        <LegendItem color={statusColor.same} label="Reused (no change)" />
      </Legend>

      <StepControls player={player} stepLabels={steps.map((s) => s.note)} />

      <Callout kind="tip" title="Two key heuristics">
        React&apos;s diff is O(n) because it assumes: (1) two elements of{' '}
        <em>different types</em> produce different trees (so it replaces the
        whole subtree), and (2) children can be matched across renders with a
        stable <code>key</code> — the subject of the next lesson.
      </Callout>
    </LessonLayout>
  )
}
