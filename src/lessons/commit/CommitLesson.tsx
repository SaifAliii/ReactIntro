import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";
import T, { useT } from "@/i18n/T";
import VTree, { type NodeStatus, type VNode } from "../_shared/VTree";

interface Step {
  phase: "idle" | "render" | "diff" | "commit" | "done";
  count: number;
  /** status for the <p> node in the virtual tree */
  pStatus: NodeStatus;
  /** is the real <p> node being mutated this step */
  commitP?: boolean;
}

const steps: Step[] = [
  { phase: "idle", count: 0, pStatus: "same" },
  { phase: "render", count: 1, pStatus: "update" },
  { phase: "diff", count: 1, pStatus: "update" },
  { phase: "commit", count: 1, pStatus: "update", commitP: true },
  { phase: "done", count: 1, pStatus: "same" },
];

function vtree(step: Step): VNode {
  return {
    id: "div",
    tag: "div",
    prop: 'className="card"',
    children: [
      { id: "h1", tag: "h1", text: '"Counter"' },
      {
        id: "p",
        tag: "p",
        text: `"Count: ${step.count}"`,
        status: step.pStatus,
      },
      { id: "button", tag: "button", text: '"+1"' },
    ],
  };
}

/** A browser-like rendering of the real DOM, flashing only the mutated node. */
function RealDom({ step }: { step: Step }) {
  const { t } = useTranslation();
  const rows: { id: string; el: React.ReactNode; touched?: boolean }[] = [
    { id: "h1", el: <span className="text-lg font-bold">Counter</span> },
    {
      id: "p",
      el: <span>Count: {step.phase === "idle" ? 0 : step.count}</span>,
      touched: step.commitP,
    },
    {
      id: "button",
      el: (
        <span className="rounded-md bg-(--color-brand) px-3 py-1 text-sm text-white">
          +1
        </span>
      ),
    },
  ];
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
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
                style={{ background: "var(--color-ok)" }}
              />
            )}
            <div className="relative flex items-center gap-2 text-ink">
              {r.el}
              <AnimatePresence>
                {step.phase === "done" && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-semibold uppercase"
                    style={{
                      color: r.touched
                        ? "var(--color-ok)"
                        : "var(--color-muted)",
                    }}
                  >
                    {r.touched
                      ? t("lessons.commit.mutated")
                      : t("lessons.commit.untouched")}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const phaseKey: Record<Step["phase"], string> = {
  idle: "lessons.commit.phaseIdle",
  render: "lessons.commit.phaseRender",
  diff: "lessons.commit.phaseDiff",
  commit: "lessons.commit.phaseCommit",
  done: "lessons.commit.phaseDone",
};

export default function CommitLesson() {
  const t = useT();
  const player = useStepPlayer(steps.length, { interval: 1700 });
  const step = steps[player.step];
  const stepLabels = t("lessons.commit.steps", {
    returnObjects: true,
  }) as string[];

  return (
    <LessonLayout slug="commit">
      <Section>
        <p>
          <T k="lessons.commit.intro" />
        </p>
      </Section>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted">
          {t("lessons.commit.phaseLabel")}
        </span>
        <span className="rounded-full border border-(--color-brand)/50 bg-(--color-brand)/15 px-3 py-1 text-sm font-semibold text-(--color-brand)">
          {t(phaseKey[step.phase])}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimationStage label={t("lessons.commit.vdomLabel")} minH={300}>
          <div className="flex h-full items-center overflow-x-auto">
            <VTree root={vtree(step)} />
          </div>
        </AnimationStage>
        <AnimationStage label={t("lessons.commit.realLabel")} minH={300}>
          <div className="flex h-full items-center justify-center">
            <RealDom step={step} />
          </div>
        </AnimationStage>
      </div>

      <StepControls player={player} stepLabels={stepLabels} />

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

      <Callout kind="tip" title={t("lessons.commit.calloutTitle")}>
        <T k="lessons.commit.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
