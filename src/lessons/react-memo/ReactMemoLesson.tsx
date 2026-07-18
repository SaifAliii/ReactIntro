import { memo, useState } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";
import RenderPulse, { useRenderCount } from "../_shared/RenderPulse";

function PlainChild({ value }: { value: number }) {
  const { t } = useTranslation();
  const renders = useRenderCount();
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-warn/50 bg-warn/8 p-5">
      <div className="text-sm font-bold text-warn">
        {t("lessons.react-memo.plainTitle")}
      </div>
      <div className="text-xs text-muted">
        {t("lessons.react-memo.propValue")}
        <span className="font-mono">{value}</span>
      </div>
      <RenderPulse
        count={renders}
        label={t("lessons.react-memo.childRenders")}
        color="var(--color-warn)"
      />
      <div className="text-xs text-warn">
        {t("lessons.react-memo.plainHint")}
      </div>
    </div>
  );
}

// Identical child, but wrapped in React.memo.
const MemoChild = memo(function MemoChild({ value }: { value: number }) {
  const { t } = useTranslation();
  const renders = useRenderCount();
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ok/50 bg-ok/8 p-5">
      <div className="text-sm font-bold text-ok">
        {t("lessons.react-memo.memoTitle")}
      </div>
      <div className="text-xs text-muted">
        {t("lessons.react-memo.propValue")}
        <span className="font-mono">{value}</span>
      </div>
      <RenderPulse
        count={renders}
        label={t("lessons.react-memo.childRenders")}
        color="var(--color-ok)"
      />
      <div className="text-xs text-ok">
        <T k="lessons.react-memo.memoHint" />
      </div>
    </div>
  );
});

export default function ReactMemoLesson() {
  const t = useT();
  const renders = useRenderCount();
  const [childValue, setChildValue] = useState(0);
  const [, setUnrelated] = useState(0);

  return (
    <LessonLayout slug="react-memo">
      <Section>
        <p>
          <T k="lessons.react-memo.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setUnrelated((n) => n + 1)}>
          {t("lessons.react-memo.changeUnrelated")}
        </Button>
        <Button type="primary" onClick={() => setChildValue((n) => n + 1)}>
          {t("lessons.react-memo.changeProp")}
        </Button>
        <RenderPulse
          count={renders}
          label={t("lessons.react-memo.parentRenders")}
        />
      </div>

      <AnimationStage minH={240}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <PlainChild value={childValue} />
          <MemoChild value={childValue} />
        </div>
      </AnimationStage>

      <Callout kind="tip" title={t("lessons.react-memo.callout1Title")}>
        <T k="lessons.react-memo.callout1Body" />
      </Callout>

      <CodeBlock
        code={`function Child({ value }) { /* ... */ }

// Only re-renders when \`value\` (shallow-compared) changes:
export default React.memo(Child)

// Need custom comparison? Pass a second arg:
React.memo(Child, (prev, next) => prev.value === next.value)`}
        language="tsx"
      />

      <Callout kind="warn" title={t("lessons.react-memo.callout2Title")}>
        <T k="lessons.react-memo.callout2Body" />
      </Callout>
    </LessonLayout>
  );
}
