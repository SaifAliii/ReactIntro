import { useRef, useState } from "react";
import { Button } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";
import RenderPulse, { useRenderCount } from "../_shared/RenderPulse";

export default function StateVsRefLesson() {
  const t = useT();
  const renders = useRenderCount();
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  const [, forceRender] = useState(0);

  return (
    <LessonLayout slug="usestate-vs-useref">
      <Section>
        <p>
          <T k="lessons.usestate-vs-useref.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <RenderPulse
          count={renders}
          label={t("lessons.usestate-vs-useref.rendersLabel")}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={() => forceRender((n) => n + 1)}
        >
          {t("lessons.usestate-vs-useref.forceRender")}
        </Button>
      </div>

      <AnimationStage minH={260}>
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          {/* useState card */}
          <div className="flex flex-col rounded-xl border border-(--color-brand)/50 bg-(--color-brand)/8 p-5">
            <div className="text-sm font-bold text-(--color-brand)">
              {t("lessons.usestate-vs-useref.useStateTitle")}
            </div>
            <div className="mt-2 font-mono text-5xl font-bold tabular-nums text-ink">
              {stateCount}
            </div>
            <div className="mt-1 text-xs text-ok">
              {t("lessons.usestate-vs-useref.stateHint")}
            </div>
            <Button
              className="mt-auto"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setStateCount((c) => c + 1)}
            >
              {t("lessons.usestate-vs-useref.stateBtn")}
            </Button>
          </div>

          {/* useRef card */}
          <div className="flex flex-col rounded-xl border border-webapi/50 bg-webapi/8 p-5">
            <div className="text-sm font-bold text-webapi">
              {t("lessons.usestate-vs-useref.useRefTitle")}
            </div>
            <div className="mt-2 font-mono text-5xl font-bold tabular-nums text-ink">
              {refCount.current}
            </div>
            <div className="mt-1 text-xs text-warn">
              {t("lessons.usestate-vs-useref.refHint")}
            </div>
            <Button
              className="mt-auto"
              icon={<PlusOutlined />}
              onClick={() => {
                refCount.current += 1;
              }}
            >
              {t("lessons.usestate-vs-useref.refBtn")}
            </Button>
          </div>
        </div>
      </AnimationStage>

      <Callout kind="tip" title={t("lessons.usestate-vs-useref.calloutTitle")}>
        <T k="lessons.usestate-vs-useref.calloutBody" />
      </Callout>

      <CodeBlock
        code={`const [stateCount, setStateCount] = useState(0)
const refCount = useRef(0)

setStateCount(c => c + 1) // ✅ schedules a re-render, UI updates
refCount.current += 1     // 🤫 mutates silently, no re-render`}
        language="js"
      />

      <Section title={t("lessons.usestate-vs-useref.whenTitle")}>
        <p>
          <T k="lessons.usestate-vs-useref.whenBody" />
        </p>
      </Section>
    </LessonLayout>
  );
}
