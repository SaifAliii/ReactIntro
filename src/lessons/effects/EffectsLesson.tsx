import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Segmented } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";
import T, { useT } from "@/i18n/T";

const tags = ["react", "react", "layout", "paint", "effect"];

const tagColor: Record<string, string> = {
  react: "var(--color-brand)",
  layout: "var(--color-brand-2)",
  paint: "var(--color-webapi)",
  effect: "var(--color-ok)",
};

type Mode = "effect" | "layout";

/** A box that starts at the far left and gets centered inside an effect. */
function FlashBox({ mode, replayKey }: { mode: Mode; replayKey: number }) {
  const { t } = useTranslation();
  const [left, setLeft] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // The component is remounted (via key) on every replay, so `left` starts at 0.
  const useChosenEffect = mode === "layout" ? useLayoutEffect : useEffect;
  useChosenEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) setLeft(parent.clientWidth - 64);
  }, [replayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-16 overflow-hidden rounded-lg bg-surface-2">
      <div
        ref={ref}
        className="absolute top-2 h-12 w-12 rounded-md"
        style={{
          left,
          transition: "none",
          background:
            mode === "layout" ? "var(--color-brand-2)" : "var(--color-ok)",
        }}
      />
      <div className="absolute bottom-1 left-2 text-[10px] text-muted">
        {t("lessons.effect-vs-layouteffect.targetLabel")}
      </div>
    </div>
  );
}

export default function EffectsLesson() {
  const t = useT();
  const player = useStepPlayer(tags.length, { interval: 1200 });
  const [mode, setMode] = useState<Mode>("effect");
  const [replayKey, setReplayKey] = useState(0);
  const timelineLabels = t("lessons.effect-vs-layouteffect.timelineLabels", {
    returnObjects: true,
  }) as string[];
  const timelineDescs = t("lessons.effect-vs-layouteffect.timelineDescs", {
    returnObjects: true,
  }) as string[];

  return (
    <LessonLayout slug="effect-vs-layouteffect">
      <Section>
        <p>
          <T k="lessons.effect-vs-layouteffect.intro" />
        </p>
      </Section>

      <AnimationStage
        label={t("lessons.effect-vs-layouteffect.orderLabel")}
        minH={200}
      >
        <div className="flex h-full items-center">
          <div className="flex w-full flex-wrap items-stretch gap-2">
            {timelineLabels.map((label, i) => {
              const on = player.step === i;
              const passed = player.step > i;
              const color = tagColor[tags[i]];
              return (
                <motion.div
                  key={label}
                  animate={{
                    opacity: on || passed ? 1 : 0.45,
                    scale: on ? 1.04 : 1,
                  }}
                  className="flex-1 rounded-xl border p-3"
                  style={{
                    minWidth: 120,
                    borderColor: on ? color : "var(--color-border)",
                    background: on
                      ? `color-mix(in srgb, ${color} 14%, transparent)`
                      : "transparent",
                    boxShadow: on ? `0 0 22px ${color}55` : "none",
                  }}
                >
                  <div
                    className="text-sm font-bold"
                    style={{ color: on ? color : "var(--color-ink)" }}
                  >
                    {label}
                  </div>
                  <div className="mt-1 text-[11px] text-muted">
                    {timelineDescs[i]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimationStage>

      <StepControls player={player} stepLabels={timelineDescs} />

      <Section title={t("lessons.effect-vs-layouteffect.seeFlickerTitle")}>
        <p>
          <T k="lessons.effect-vs-layouteffect.seeFlickerBody" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <Segmented<Mode>
            value={mode}
            onChange={setMode}
            options={[
              {
                label: t("lessons.effect-vs-layouteffect.segEffect"),
                value: "effect",
              },
              {
                label: t("lessons.effect-vs-layouteffect.segLayout"),
                value: "layout",
              },
            ]}
            className="[&>.ant-segmented-group]:gap-3"
          />
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => setReplayKey((k) => k + 1)}
        >
          {t("lessons.effect-vs-layouteffect.replay")}
        </Button>
      </div>

      <AnimationStage minH={120}>
        <div className="flex h-full items-center">
          <div className="w-full">
            <FlashBox
              key={`${mode}-${replayKey}`}
              mode={mode}
              replayKey={replayKey}
            />
          </div>
        </div>
      </AnimationStage>

      <CodeBlock
        code={`// Runs AFTER the browser paints — safe default, may flicker on layout changes
useEffect(() => {
  const { width } = ref.current.getBoundingClientRect()
  setTooltipLeft(width)
})

// Runs BEFORE the browser paints — use for DOM measurement / positioning
useLayoutEffect(() => {
  const { width } = ref.current.getBoundingClientRect()
  setTooltipLeft(width) // corrected before the user sees anything
})`}
        language="tsx"
      />

      <Callout
        kind="tip"
        title={t("lessons.effect-vs-layouteffect.calloutTitle")}
      >
        <T k="lessons.effect-vs-layouteffect.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
