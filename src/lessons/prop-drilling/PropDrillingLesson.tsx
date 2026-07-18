import { useState } from "react";
import { Segmented } from "antd";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import StepControls from "@/components/StepControls";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Section } from "@/components/ui";
import { useStepPlayer } from "@/components/useStepPlayer";
import PropFlowViz, { levels, type Mode } from "./PropFlowViz";

const drillLabels = [
  "App owns the user data",
  "Passed down to Dashboard…",
  "…which forwards it to Sidebar…",
  "…which forwards it to ProfileMenu…",
  "Finally Avatar receives and uses it",
];

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
  const [mode, setMode] = useState<Mode>("drilling");
  const player = useStepPlayer(levels.length, { interval: 1300 });

  return (
    <LessonLayout slug="prop-drilling">
      <Section>
        <p>
          <strong className="text-[var(--color-ink)]">Prop drilling</strong> is
          what happens when a piece of data lives high in the tree but is only
          needed deep down. To get it there, you have to thread it as a prop
          through every component in between — even though those middle
          components don&apos;t use it at all. It works, but it makes the
          intermediate components noisy and awkward to refactor.
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
              { label: "① Prop drilling (the problem)", value: "drilling" },
              { label: "② Context (the fix)", value: "context" },
            ]}
            className="[&>.ant-segmented-group]:gap-3"
          />
        </div>
        <span className="text-sm text-[var(--color-muted)]">
          {mode === "drilling"
            ? "Watch the prop pass through every layer."
            : "Context sends it straight to the consumer."}
        </span>
      </div>

      <AnimationStage
        label={mode === "drilling" ? "Prop drilling" : "React Context"}
        minH={340}
      >
        <PropFlowViz mode={mode} step={player.step} />
      </AnimationStage>

      {mode === "drilling" && (
        <StepControls player={player} stepLabels={drillLabels} />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-warn)]">
            The problem — drilling
          </div>
          <CodeBlock code={drillingCode} language="tsx" />
        </div>
        <div className="min-w-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-ok)]">
            The fix — Context
          </div>
          <CodeBlock code={contextCode} language="tsx" />
        </div>
      </div>

      <Callout kind="tip" title="When drilling is fine — and when it isn't">
        Passing a prop down one or two levels is perfectly normal; don&apos;t
        reach for Context immediately. Drilling becomes a smell when the same
        prop travels through several components that only relay it, or when
        adding a new consumer means editing a long chain. Then a shared{" "}
        <code>Context</code> (or a state library) keeps the middle layers clean.
      </Callout>

      <Callout kind="warn" title="Context isn't free either">
        Every component that calls <code>useContext</code> re-renders whenever
        the context value changes. For values that update very often, prefer
        splitting contexts, memoizing the value, or composing components
        (passing JSX as <code>children</code>) so you drill less without a
        global store.
      </Callout>
    </LessonLayout>
  );
}
