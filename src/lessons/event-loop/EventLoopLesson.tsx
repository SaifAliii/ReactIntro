import LessonLayout from '@/components/LessonLayout'
import AnimationStage from '@/components/AnimationStage'
import StepControls from '@/components/StepControls'
import CodeBlock from '@/components/CodeBlock'
import { Callout, Legend, LegendItem, Section } from '@/components/ui'
import { useStepPlayer } from '@/components/useStepPlayer'
import T, { useT } from '@/i18n/T'
import EventLoopViz from './EventLoopViz'
import { eventLoopCode, eventLoopSteps } from './steps'

export default function EventLoopLesson() {
  const t = useT()
  const player = useStepPlayer(eventLoopSteps.length, { interval: 1400 })
  const state = eventLoopSteps[player.step]
  const stepLabels = eventLoopSteps.map((_, i) =>
    i === 0 ? t('common.start') : t('common.tick', { n: i }),
  )

  return (
    <LessonLayout slug="event-loop">
      <Section>
        <p>
          <T k="lessons.event-loop.intro" />
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
            <LegendItem
              color="var(--color-stack)"
              label={t('lessons.event-loop.legendStack')}
            />
            <LegendItem
              color="var(--color-webapi)"
              label={t('lessons.event-loop.legendWebapi')}
            />
            <LegendItem
              color="var(--color-micro)"
              label={t('lessons.event-loop.legendMicro')}
            />
            <LegendItem
              color="var(--color-macro)"
              label={t('lessons.event-loop.legendMacro')}
            />
          </Legend>
        </div>

        <AnimationStage minH={470}>
          <EventLoopViz state={state} />
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={stepLabels} />

      <Callout kind="tip" title={t('lessons.event-loop.ruleTitle')}>
        <T k="lessons.event-loop.ruleBody" />
      </Callout>

      <Section title={t('lessons.event-loop.whyTitle')}>
        <p>
          <T k="lessons.event-loop.whyBody" />
        </p>
      </Section>
    </LessonLayout>
  )
}
