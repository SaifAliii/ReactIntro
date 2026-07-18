import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";
import RenderPulse, { useRenderCount } from "../_shared/RenderPulse";

const STAGE_COUNT = 4;

/**
 * The stage animation lives in its OWN component so that its internal `active`
 * state changes don't re-render the parent. That keeps the parent's render
 * counter honest: exactly one re-render per setCount click.
 */
function Pipeline({ trigger }: { trigger: number }) {
  const t = useT();
  const [active, setActive] = useState(-1);
  const timers = useRef<number[]>([]);
  const titles = t("lessons.state-render.stageTitles", {
    returnObjects: true,
  }) as string[];
  const descs = t("lessons.state-render.stageDescs", {
    returnObjects: true,
  }) as string[];

  useEffect(() => {
    if (trigger === 0) return; // don't animate on the initial mount
    timers.current.forEach(clearTimeout);
    timers.current = [];
    for (let i = 0; i < STAGE_COUNT; i++) {
      timers.current.push(window.setTimeout(() => setActive(i), i * 420));
    }
    timers.current.push(
      window.setTimeout(() => setActive(-1), STAGE_COUNT * 420 + 500),
    );
    return () => timers.current.forEach(clearTimeout);
  }, [trigger]);

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
      {titles.map((title, i) => {
        const on = active === i;
        const done = active > i || (active === -1 && trigger > 0);
        const color = on
          ? "var(--color-brand)"
          : done
            ? "var(--color-ok)"
            : "var(--color-border)";
        return (
          <motion.div
            key={i}
            animate={{
              scale: on ? 1.05 : 1,
              borderColor: color,
              boxShadow: on
                ? "0 0 24px color-mix(in srgb, var(--color-brand) 45%, transparent)"
                : "0 0 0px transparent",
            }}
            className="rounded-xl border bg-surface/60 p-4"
          >
            <div
              className="text-sm font-bold"
              style={{ color: on ? "var(--color-brand)" : "var(--color-ink)" }}
            >
              {title}
            </div>
            <div className="mt-1 text-xs text-muted">{descs[i]}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function StateRenderLesson() {
  const t = useT();
  const renders = useRenderCount();
  const [count, setCount] = useState(0);

  return (
    <LessonLayout slug="state-render">
      <Section>
        <p>
          <T k="lessons.state-render.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCount((c) => c + 1)}
        >
          {t("lessons.state-render.button", { from: count, to: count + 1 })}
        </Button>
        <RenderPulse
          count={renders}
          label={t("lessons.state-render.rendersLabel")}
        />
        <div className="rounded-lg border border-border px-3 py-1.5 text-sm">
          <span className="text-muted">
            {t("lessons.state-render.countLabel")}
          </span>
          <span className="font-mono font-bold text-brand-2">{count}</span>
        </div>
      </div>

      <AnimationStage minH={220}>
        <div className="flex h-full items-center">
          <Pipeline trigger={count} />
        </div>
      </AnimationStage>

      <CodeBlock
        code={`const [count, setCount] = useState(0)

// This does NOT mutate a variable in place.
// It tells React: "the next render should see count + 1",
// then schedules that render.
setCount(count + 1)`}
        language="js"
      />

      <Callout kind="info" title={t("lessons.state-render.calloutTitle")}>
        <T k="lessons.state-render.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
