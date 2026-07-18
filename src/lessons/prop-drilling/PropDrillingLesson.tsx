import { useState } from "react";
import { Segmented } from "antd";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";
import T, { useT } from "@/i18n/T";
import PropFlowViz, { levels, type Mode } from "./PropFlowViz";

const drillingCode = `function App() {
  const [user] = useState({ name: 'Ada' })
  return <Dashboard user={user} />          // ← only App needs it
}

// Every layer must accept and forward \`user\`, unused:
const Dashboard = ({ user }) => <Sidebar user={user} />
const Sidebar = ({ user }) => <ProfileMenu user={user} />
const ProfileMenu = ({ user }) => <Avatar user={user} />

const Avatar = ({ user }) => <span>Hi, {user.name}</span> // ← only this uses it`;

const contextCode = `const UserContext = createContext(null)

function App() {
  const [user] = useState({ name: 'Ada' })
  return (
    <UserContext.Provider value={user}>
      <Dashboard />               {/* no user prop needed */}
    </UserContext.Provider>
  )
}

// Intermediate components stay clean — they never mention user:
const Dashboard = () => <Sidebar />
const Sidebar = () => <ProfileMenu />
const ProfileMenu = () => <Avatar />

const Avatar = () => {
  const user = useContext(UserContext) // ← reaches in directly
  return <span>Hi, {user.name}</span>
}`;

export default function PropDrillingLesson() {
  const t = useT();
  const [mode, setMode] = useState<Mode>("drilling");
  const player = useStepPlayer(levels.length, { interval: 1300 });
  const drillLabels = t("lessons.prop-drilling.steps", {
    returnObjects: true,
  }) as string[];

  return (
    <LessonLayout slug="prop-drilling">
      <Section>
        <p>
          <T k="lessons.prop-drilling.intro" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <Segmented<Mode>
            value={mode}
            onChange={(m) => {
              setMode(m);
              player.reset();
            }}
            options={[
              {
                label: t("lessons.prop-drilling.segDrilling"),
                value: "drilling",
              },
              {
                label: t("lessons.prop-drilling.segContext"),
                value: "context",
              },
            ]}
            className="[&>.ant-segmented-group]:gap-3"
          />
        </div>
        <span className="text-sm text-muted">
          {mode === "drilling"
            ? t("lessons.prop-drilling.watchDrilling")
            : t("lessons.prop-drilling.watchContext")}
        </span>
      </div>

      <AnimationStage
        label={
          mode === "drilling"
            ? t("lessons.prop-drilling.stageDrilling")
            : t("lessons.prop-drilling.stageContext")
        }
        minH={340}
      >
        <PropFlowViz mode={mode} step={player.step} />
      </AnimationStage>

      {mode === "drilling" && (
        <StepControls player={player} stepLabels={drillLabels} />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-warn">
            {t("lessons.prop-drilling.problemLabel")}
          </div>
          <CodeBlock code={drillingCode} language="tsx" />
        </div>
        <div className="min-w-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ok">
            {t("lessons.prop-drilling.fixLabel")}
          </div>
          <CodeBlock code={contextCode} language="tsx" />
        </div>
      </div>

      <Callout kind="tip" title={t("lessons.prop-drilling.callout1Title")}>
        <T k="lessons.prop-drilling.callout1Body" />
      </Callout>

      <Callout kind="warn" title={t("lessons.prop-drilling.callout2Title")}>
        <T k="lessons.prop-drilling.callout2Body" />
      </Callout>
    </LessonLayout>
  );
}
