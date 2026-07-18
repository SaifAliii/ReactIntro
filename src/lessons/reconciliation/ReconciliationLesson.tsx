import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import { Callout, Legend, LegendItem, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";
import T, { useT } from "@/i18n/T";
import VTree, {
  statusColor,
  type NodeStatus,
  type VNode,
} from "../_shared/VTree";

interface Step {
  /** which node id is being compared right now */
  active?: string;
  /** final diff status per new-tree node id */
  newStatus: Record<string, NodeStatus>;
}

const steps: Step[] = [
  { newStatus: {} },
  { active: "ul", newStatus: {} },
  { active: "li1", newStatus: {} },
  { active: "li2", newStatus: { li2: "update" } },
  { active: "li3", newStatus: { li2: "update", li3: "add" } },
  { newStatus: { li2: "update", li3: "add" } },
];

const oldTree: VNode = {
  id: "ul",
  tag: "ul",
  children: [
    { id: "li1", tag: "li", text: '"Buy milk"' },
    { id: "li2", tag: "li", text: '"Walk dog"' },
  ],
};

function newTree(step: Step): VNode {
  const s = (id: string): NodeStatus =>
    step.active === id ? "active" : (step.newStatus[id] ?? "same");
  return {
    id: "ul",
    tag: "ul",
    status: s("ul"),
    children: [
      { id: "li1", tag: "li", text: '"Buy milk"', status: s("li1") },
      { id: "li2", tag: "li", text: '"Walk cat"', status: s("li2") },
      ...(step.newStatus.li3 || step.active === "li3"
        ? [
            {
              id: "li3",
              tag: "li",
              text: '"Read book"',
              status: s("li3"),
            } as VNode,
          ]
        : []),
    ],
  };
}

function oldWithActive(active?: string): VNode {
  const mark = (n: VNode): VNode => ({
    ...n,
    status: active === n.id ? "active" : "same",
    children: n.children?.map(mark),
  });
  return mark(oldTree);
}

export default function ReconciliationLesson() {
  const t = useT();
  const player = useStepPlayer(steps.length, { interval: 1800 });
  const step = steps[player.step];
  const stepLabels = t("lessons.reconciliation.steps", {
    returnObjects: true,
  }) as string[];

  return (
    <LessonLayout slug="reconciliation">
      <Section>
        <p>
          <T k="lessons.reconciliation.intro" />
        </p>
      </Section>

      <AnimationStage minH={340}>
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="overflow-x-auto border-b border-border pb-4 sm:border-b-0 sm:pb-0">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {t("lessons.reconciliation.previousTree")}
            </div>
            <VTree root={oldWithActive(step.active)} />
          </div>
          <div className="overflow-x-auto sm:border-l sm:border-border sm:pl-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {t("lessons.reconciliation.newTree")}
            </div>
            <VTree root={newTree(step)} />
          </div>
        </div>
      </AnimationStage>

      <Legend>
        <LegendItem
          color={statusColor.active}
          label={t("lessons.reconciliation.legendComparing")}
        />
        <LegendItem
          color={statusColor.update}
          label={t("lessons.reconciliation.legendChanged")}
        />
        <LegendItem
          color={statusColor.add}
          label={t("lessons.reconciliation.legendInserted")}
        />
        <LegendItem
          color={statusColor.same}
          label={t("lessons.reconciliation.legendReused")}
        />
      </Legend>

      <StepControls player={player} stepLabels={stepLabels} />

      <Callout kind="tip" title={t("lessons.reconciliation.calloutTitle")}>
        <T k="lessons.reconciliation.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
