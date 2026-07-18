import { useMemo, useRef, useState } from "react";
import { Button, InputNumber } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";
import RenderPulse, { useRenderCount } from "../_shared/RenderPulse";

// A deliberately slow computation so caching it clearly matters.
function slowFactorSum(n: number) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= 20000; j++) {
      sum += (i * j) % 7;
    }
  }
  return sum;
}

export default function UseMemoLesson() {
  const t = useT();
  const renders = useRenderCount();
  const [n, setN] = useState(3);
  const [, setTick] = useState(0);

  // WITHOUT memo: recomputed on every single render.
  const noMemoCalls = useRef(0);
  noMemoCalls.current += 1;
  slowFactorSum(n);

  // WITH memo: recomputed only when `n` changes.
  const memoCalls = useRef(0);
  const memoResult = useMemo(() => {
    memoCalls.current += 1;
    return slowFactorSum(n);
  }, [n]);

  return (
    <LessonLayout slug="usememo">
      <Section>
        <p>
          <T k="lessons.usememo.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">
          {t("lessons.usememo.inputN")}
        </span>
        <InputNumber
          min={1}
          max={12}
          value={n}
          onChange={(v) => setN(v ?? 1)}
        />
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setTick((v) => v + 1)}
        >
          {t("lessons.usememo.reRenderUnrelated")}
        </Button>
        <RenderPulse
          count={renders}
          label={t("lessons.usememo.componentRenders")}
        />
      </div>

      <AnimationStage minH={220}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-warn/50 bg-warn/8 p-5">
            <div className="text-sm font-bold text-warn">
              {t("lessons.usememo.withoutTitle")}
            </div>
            <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-ink">
              {noMemoCalls.current}
            </div>
            <div className="text-xs text-warn">
              <T k="lessons.usememo.withoutDesc" />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl border border-ok/50 bg-ok/8 p-5">
            <div className="text-sm font-bold text-ok">
              {t("lessons.usememo.withTitle")}
            </div>
            <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-ink">
              {memoCalls.current}
            </div>
            <div className="text-xs text-ok">
              <T k="lessons.usememo.withDescPrefix" />
              <span className="font-mono">{memoResult}</span>
            </div>
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title={t("lessons.usememo.calloutTitle")}>
        <T k="lessons.usememo.calloutBody" />
      </Callout>

      <CodeBlock
        code={`// ❌ runs on every render
const total = slowFactorSum(n)

// ✅ runs only when n changes; otherwise returns the cached value
const total = useMemo(() => slowFactorSum(n), [n])`}
        language="js"
      />

      <Section title={t("lessons.usememo.vsTitle")}>
        <p>
          <T k="lessons.usememo.vsBody" />
        </p>
      </Section>
    </LessonLayout>
  );
}
