import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Segmented } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";

const timeline = [
  { label: "Render", desc: "React builds the new tree", tag: "react" },
  { label: "Commit", desc: "React mutates the DOM", tag: "react" },
  {
    label: "useLayoutEffect",
    desc: "fires synchronously — BEFORE paint",
    tag: "layout",
  },
  { label: "🖼 Browser paint", desc: "pixels hit the screen", tag: "paint" },
  {
    label: "useEffect",
    desc: "fires asynchronously — AFTER paint",
    tag: "effect",
  },
];

const tagColor: Record<string, string> = {
  react: "var(--color-brand)",
  layout: "var(--color-brand-2)",
  paint: "var(--color-webapi)",
  effect: "var(--color-ok)",
};

type Mode = "effect" | "layout";

/** A box that starts at the far left and gets centered inside an effect. */
function FlashBox({ mode, replayKey }: { mode: Mode; replayKey: number }) {
  const [left, setLeft] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // The component is remounted (via key) on every replay, so `left` starts at 0.
  const useChosenEffect = mode === "layout" ? useLayoutEffect : useEffect;
  useChosenEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) setLeft(parent.clientWidth - 64);
  }, [replayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-16 overflow-hidden rounded-lg bg-[var(--color-surface-2)]">
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
      <div className="absolute bottom-1 left-2 text-[10px] text-[var(--color-muted)]">
        target →
      </div>
    </div>
  );
}

export default function EffectsLesson() {
  const player = useStepPlayer(timeline.length, { interval: 1200 });
  const [mode, setMode] = useState<Mode>("effect");
  const [replayKey, setReplayKey] = useState(0);

  return (
    <LessonLayout slug="effect-vs-layouteffect">
      <Section>
        <p>
          Both hooks run <em>after</em> render, but on opposite sides of the
          browser paint. <code>useLayoutEffect</code> fires{" "}
          <strong className="text-[var(--color-ink)]">
            synchronously before the browser paints
          </strong>{" "}
          — so DOM measurements and corrections happen invisibly.{" "}
          <code>useEffect</code> fires{" "}
          <strong className="text-[var(--color-ink)]">after paint</strong>, so
          any DOM change it makes can cause a visible flicker.
        </p>
      </Section>

      <AnimationStage label="Order of operations" minH={200}>
        <div className="flex h-full items-center">
          <div className="flex w-full flex-wrap items-stretch gap-2">
            {timeline.map((t, i) => {
              const on = player.step === i;
              const passed = player.step > i;
              const color = tagColor[t.tag];
              return (
                <motion.div
                  key={t.label}
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
                    {t.label}
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--color-muted)]">
                    {t.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimationStage>

      <StepControls player={player} stepLabels={timeline.map((t) => t.desc)} />

      <Section title="See the flicker">
        <p>
          Below, a box mounts at the left edge and an effect moves it to the
          right. With <code>useEffect</code> the browser can paint the box at
          the wrong spot first (a flash). With <code>useLayoutEffect</code> the
          move happens before paint, so you only ever see the final position.
          Switch modes and hit replay.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <Segmented<Mode>
            value={mode}
            onChange={setMode}
            options={[
              { label: "useEffect (after paint)", value: "effect" },
              { label: "useLayoutEffect (before paint)", value: "layout" },
            ]}
            className="[&>.ant-segmented-group]:gap-3"
          />
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => setReplayKey((k) => k + 1)}
        >
          Replay mount
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

      <Callout kind="tip" title="Which should I use?">
        Default to <code>useEffect</code> — it doesn&apos;t block painting, so
        it keeps the UI responsive. Reach for <code>useLayoutEffect</code> only
        when you must read layout (size/position) and synchronously re-adjust
        the DOM to avoid a visible jump: tooltips, measuring, scroll
        restoration.
      </Callout>
    </LessonLayout>
  );
}
