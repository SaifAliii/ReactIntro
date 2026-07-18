import { memo, useCallback, useRef, useState } from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";
import RenderPulse, { useRenderCount } from "../_shared/RenderPulse";

interface ChildProps {
  title: string;
  onAction: () => void;
  color: string;
}

// Wrapped in React.memo so it only re-renders when its props actually change.
const MemoChild = memo(function MemoChild({ title, color }: ChildProps) {
  const { t } = useTranslation();
  const renders = useRenderCount();
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-4"
      style={{ borderColor: `${color}66` }}
    >
      <div className="text-sm font-bold" style={{ color }}>
        {title}
      </div>
      <RenderPulse
        count={renders}
        label={t("lessons.usecallback.childRenders")}
        color={color}
      />
    </div>
  );
});

export default function UseCallbackLesson() {
  const t = useT();
  const [, setTick] = useState(0);

  // Recreated on every render → a brand-new function identity each time.
  const unstable = () => {};
  // Memoized → the exact same function reference across renders.
  const stable = useCallback(() => {}, []);

  // Track how often each identity actually changes.
  const unstableId = useRef(0);
  const prevUnstable = useRef<() => void>(unstable);
  if (prevUnstable.current !== unstable) {
    unstableId.current += 1;
    prevUnstable.current = unstable;
  }
  const stableId = useRef(0);
  const prevStable = useRef<() => void>(stable);
  if (prevStable.current !== stable) {
    stableId.current += 1;
    prevStable.current = stable;
  }

  return (
    <LessonLayout slug="usecallback">
      <Section>
        <p>
          <T k="lessons.usecallback.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setTick((v) => v + 1)}
        >
          {t("lessons.usecallback.reRenderParent")}
        </Button>
        <span className="text-sm text-muted">
          {t("lessons.usecallback.hint")}
        </span>
      </div>

      <AnimationStage minH={230}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-muted">
              {t("lessons.usecallback.identityLabel")}{" "}
              <span className="font-mono font-bold text-warn">
                #{unstableId.current}
              </span>{" "}
              {t("lessons.usecallback.changesEvery")}
            </div>
            <MemoChild
              title={t("lessons.usecallback.childPlain")}
              onAction={unstable}
              color="var(--color-warn)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-muted">
              {t("lessons.usecallback.identityLabel")}{" "}
              <span className="font-mono font-bold text-ok">
                #{stableId.current}
              </span>{" "}
              {t("lessons.usecallback.stable")}
            </div>
            <MemoChild
              title={t("lessons.usecallback.childMemo")}
              onAction={stable}
              color="var(--color-ok)"
            />
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title={t("lessons.usecallback.callout1Title")}>
        <T k="lessons.usecallback.callout1Body" />
      </Callout>

      <CodeBlock
        code={`// ❌ new function every render → memo child re-renders
const handleClick = () => doThing(id)

// ✅ same function until \`id\` changes → memo child can skip
const handleClick = useCallback(() => doThing(id), [id])

<MemoChild onClick={handleClick} />`}
        language="tsx"
      />

      <Callout kind="warn" title={t("lessons.usecallback.callout2Title")}>
        <T k="lessons.usecallback.callout2Body" />
      </Callout>
    </LessonLayout>
  );
}
