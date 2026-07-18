import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Segmented, Spin } from "antd";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";

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
  const [loading, setLoading] = useState<"true" | "false">("false");

  return (
    <LessonLayout slug="hoc">
      <Section>
        <p>
          A <strong className="text-ink">Higher-Order Component</strong> is just
          a function that takes a component and returns a new one with extra
          behavior wrapped around it — the component equivalent of a decorator.
          The pattern: <code>const Enhanced = withSomething(Base)</code>.
          React&apos;s own <code>React.memo</code> is an HOC, as were{" "}
          <code>connect()</code> (Redux) and <code>withRouter</code>.
        </p>
      </Section>

      {/* Wrapping visualization */}
      <AnimationStage label="withLoading( Profile )" minH={220}>
        <div className="flex h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-2xl border-2 border-dashed border-(--color-brand) p-6"
          >
            <div className="absolute -top-3 left-4 bg-bg px-2 text-xs font-semibold text-(--color-brand)">
              withLoading( ) — adds loading behavior + passes props through
            </div>
            <motion.div
              layout
              className="rounded-xl border border-brand-2/50 p-4"
            >
              <div className="mb-2 text-xs font-semibold text-brand-2">
                Profile (unchanged, unaware it&apos;s wrapped)
              </div>
              <Profile name="Ada Lovelace" role="Mathematician" />
            </motion.div>
          </motion.div>
        </div>
      </AnimationStage>

      <Section title="The enhanced component in action">
        <p>
          <code>ProfileWithLoading</code> understands a new <code>loading</code>{" "}
          prop that plain <code>Profile</code> knows nothing about. Toggle it:
        </p>
      </Section>

      <div className="flex items-center gap-3">
        <Segmented<"true" | "false">
          value={loading}
          onChange={setLoading}
          options={[
            { label: "loading = false", value: "false" },
            { label: "loading = true", value: "true" },
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

      <Callout kind="info" title="HOCs today: hooks usually win">
        Most things HOCs were used for — sharing logic, injecting data,
        cross-cutting behavior — are now done more simply with{" "}
        <strong className="text-ink">custom hooks</strong> (e.g. a{" "}
        <code>useLoading()</code> hook instead of <code>withLoading</code>).
        HOCs are still worth knowing: you&apos;ll meet them in libraries, and{" "}
        <code>React.memo</code> is one you&apos;ll use constantly.
      </Callout>
    </LessonLayout>
  );
}
