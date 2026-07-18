import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Segmented, Spin } from "antd";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import T, { useT } from "@/i18n/T";

interface ProfileProps {
  name: string;
  role: string;
}

// The plain "wrapped" component.
function Profile({ name, role }: ProfileProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="text-base font-bold text-ink">{name}</div>
      <div className="text-sm text-muted">{role}</div>
    </div>
  );
}

// The Higher-Order Component: a function that takes a component and returns a
// new, enhanced component — here adding a `loading` capability.
function withLoading<P extends object>(Wrapped: ComponentType<P>) {
  return function WithLoading(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    if (loading) {
      return (
        <div className="grid h-21.5 place-items-center rounded-lg border border-dashed border-(--color-brand)/60">
          <Spin />
        </div>
      );
    }
    return <Wrapped {...(rest as P)} />;
  };
}

const ProfileWithLoading = withLoading(Profile);

export default function HocLesson() {
  const t = useT();
  const [loading, setLoading] = useState<"true" | "false">("false");

  return (
    <LessonLayout slug="hoc">
      <Section>
        <p>
          <T k="lessons.hoc.intro" />
        </p>
      </Section>

      {/* Wrapping visualization */}
      <AnimationStage label={t("lessons.hoc.wrapLabel")} minH={220}>
        <div className="flex h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-2xl border-2 border-dashed border-(--color-brand) p-6"
          >
            <div className="absolute -top-3 left-4 bg-bg px-2 text-xs font-semibold text-(--color-brand)">
              {t("lessons.hoc.wrapCaption")}
            </div>
            <motion.div
              layout
              className="rounded-xl border border-brand-2/50 p-4"
            >
              <div className="mb-2 text-xs font-semibold text-brand-2">
                {t("lessons.hoc.profileNote")}
              </div>
              <Profile name="Ada Lovelace" role="Mathematician" />
            </motion.div>
          </motion.div>
        </div>
      </AnimationStage>

      <Section title={t("lessons.hoc.inActionTitle")}>
        <p>
          <T k="lessons.hoc.inActionBody" />
        </p>
      </Section>

      <div className="flex items-center gap-3">
        <Segmented<"true" | "false">
          value={loading}
          onChange={setLoading}
          options={[
            { label: t("lessons.hoc.segFalse"), value: "false" },
            { label: t("lessons.hoc.segTrue"), value: "true" },
          ]}
          className="[&>.ant-segmented-group]:gap-3"
        />
      </div>

      <AnimationStage minH={140}>
        <div className="flex h-full items-center justify-center">
          <div className="w-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={loading}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ProfileWithLoading
                  loading={loading === "true"}
                  name="Ada Lovelace"
                  role="Mathematician"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </AnimationStage>

      <CodeBlock
        code={`// An HOC: component in, enhanced component out.
function withLoading(Wrapped) {
  return function WithLoading({ loading, ...rest }) {
    if (loading) return <Spinner />
    return <Wrapped {...rest} />
  }
}

const ProfileWithLoading = withLoading(Profile)

// Usage — Profile itself never changed:
<ProfileWithLoading loading={isLoading} name="Ada" role="Mathematician" />`}
        language="tsx"
      />

      <Callout kind="info" title={t("lessons.hoc.calloutTitle")}>
        <T k="lessons.hoc.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
