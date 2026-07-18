import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export type Mode = "drilling" | "context";

export interface Level {
  id: string;
  name: string;
  /** role in the data flow */
  kind: "owner" | "pass" | "consumer";
  /** i18n key for the small note beside the component name */
  noteKey?: string;
}

export const levels: Level[] = [
  { id: "app", name: "App", kind: "owner", noteKey: "viz.propFlow.ownsUser" },
  { id: "dashboard", name: "Dashboard", kind: "pass" },
  { id: "sidebar", name: "Sidebar", kind: "pass" },
  { id: "profileMenu", name: "ProfileMenu", kind: "pass" },
  {
    id: "avatar",
    name: "Avatar",
    kind: "consumer",
    noteKey: "viz.propFlow.needsUser",
  },
];

const kindColor: Record<Level["kind"], string> = {
  owner: "var(--color-brand)",
  pass: "var(--color-muted)",
  consumer: "var(--color-ok)",
};

const PROP = "user={{ name: 'Ada' }}";

function Token() {
  return (
    <motion.span
      layout
      layoutId="prop-token"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="rounded-md border px-2 py-1 font-mono text-[11px] text-ink"
      style={{
        borderColor: "var(--color-brand)",
        background:
          "linear-gradient(color-mix(in srgb, var(--color-brand) 20%, var(--color-surface-2)), color-mix(in srgb, var(--color-brand) 20%, var(--color-surface-2)))",
        boxShadow:
          "0 0 16px color-mix(in srgb, var(--color-brand) 40%, transparent)",
      }}
    >
      {PROP}
    </motion.span>
  );
}

export default function PropFlowViz({
  mode,
  step,
}: {
  mode: Mode;
  step: number;
}) {
  const { t } = useTranslation();
  const lastIndex = levels.length - 1;
  const tokenIndex = mode === "context" ? lastIndex : step;

  return (
    <div className="relative flex h-full flex-col justify-center gap-2 py-2">
      {/* Context "channel": a glowing line straight from provider to consumer */}
      {mode === "context" && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute right-6 top-6 bottom-6 w-1 origin-top rounded-full"
          style={{
            background:
              "linear-gradient(var(--color-brand), var(--color-brand-2), var(--color-ok))",
            boxShadow:
              "0 0 18px color-mix(in srgb, var(--color-brand-2) 60%, transparent)",
          }}
        >
          <motion.span
            className="absolute -right-1 h-3 w-3 rounded-full bg-white"
            animate={{ top: ["2%", "92%"] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {levels.map((lvl, i) => {
        const color = kindColor[lvl.kind];
        const hasToken = i === tokenIndex;
        const forwarded =
          mode === "drilling" && lvl.kind === "pass" && i < step;
        const skipped = mode === "context" && lvl.kind === "pass";
        const consumed =
          lvl.kind === "consumer" &&
          ((mode === "drilling" && step >= lastIndex) || mode === "context");

        return (
          <div
            key={lvl.id}
            style={{ marginLeft: `calc(${i} * clamp(8px, 2.4vw, 26px))` }}
          >
            <motion.div
              animate={{
                opacity: skipped ? 0.4 : 1,
                borderColor: hasToken ? color : "var(--color-border)",
              }}
              className="relative flex min-w-0 items-center gap-2 rounded-xl border bg-surface/60 px-2.5 py-2 sm:gap-3 sm:px-3"
              style={{
                boxShadow: hasToken
                  ? `0 0 20px color-mix(in srgb, ${color} 30%, transparent)`
                  : "none",
              }}
            >
              <span
                className="shrink-0 font-mono text-[13px] font-semibold sm:text-sm"
                style={{ color }}
              >
                &lt;{lvl.name}&gt;
              </span>
              {lvl.noteKey && (
                <span className="hidden truncate text-[11px] text-muted sm:inline">
                  {t(lvl.noteKey)}
                </span>
              )}

              {/* status chips */}
              {forwarded && (
                <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warn ring-1 ring-warn/50">
                  {t("viz.propFlow.justForwards")}
                </span>
              )}
              {skipped && (
                <span className="ml-auto text-[10px] font-semibold uppercase text-muted">
                  {t("viz.propFlow.skipped")}
                </span>
              )}
              {consumed && (
                <span className="ml-auto rounded px-1.5 py-0.5 text-[11px] font-semibold text-ok ring-1 ring-ok/50">
                  {t("viz.propFlow.consumed")}
                </span>
              )}

              {/* the travelling prop token — a single element that flies
                  between cards via its shared layoutId (no AnimatePresence,
                  which would leave orphaned copies during rapid transitions) */}
              {hasToken && !consumed && (
                <span className="ml-auto">
                  <Token />
                </span>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
