import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Segmented } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LessonLayout from "@/components/LessonLayout";
import AnimationStage from "@/components/AnimationStage";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Legend, LegendItem, Section } from "@/components/ui";
import T from "@/i18n/T";

interface Item {
  id: number;
  label: string;
}

const initial: Item[] = [
  { id: 1, label: "Apple" },
  { id: 2, label: "Banana" },
  { id: 3, label: "Cherry" },
];
const pool = ["Mango", "Kiwi", "Peach", "Plum", "Grape", "Melon"];

type KeyMode = "index" | "id";

function List({
  items,
  mode,
  touched,
  opKey,
}: {
  items: Item[];
  mode: KeyMode;
  touched: Set<number>;
  opKey: number;
}) {
  const { t } = useTranslation();
  const touchedCount = touched.size;
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="font-mono text-sm text-ink">
          key={mode === "index" ? "{index}" : "{item.id}"}
        </span>
        <span
          className="text-[11px] font-semibold sm:text-xs"
          style={{
            color: touchedCount > 1 ? "var(--color-warn)" : "var(--color-ok)",
          }}
        >
          {opKey === 0 ? "—" : t("lessons.keys.touched", { n: touchedCount })}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, index) => {
            const isTouched =
              mode === "index" ? touched.has(index) : touched.has(item.id);
            const color = isTouched ? "var(--color-warn)" : "var(--color-ok)";
            return (
              <motion.div
                key={mode === "index" ? index : item.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative overflow-hidden rounded-lg border px-3 py-2 font-mono text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* flash overlay that re-triggers each operation */}
                {isTouched && opKey > 0 && (
                  <motion.span
                    key={opKey}
                    className="absolute inset-0"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.1 }}
                    style={{ background: color }}
                  />
                )}
                <span className="relative flex items-center justify-between">
                  <span className="text-ink">{item.label}</span>
                  {opKey > 0 && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ color, border: `1px solid ${color}` }}
                    >
                      {isTouched
                        ? t("lessons.keys.updated")
                        : t("lessons.keys.reused")}
                    </span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function KeysLesson() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>(initial);
  const [nextId, setNextId] = useState(4);
  const [opKey, setOpKey] = useState(0);
  // touched sets computed for the last prepend operation
  const [touchedIndex, setTouchedIndex] = useState<Set<number>>(new Set());
  const [touchedId, setTouchedId] = useState<Set<number>>(new Set());
  const [highlight, setHighlight] = useState<KeyMode>("index");

  const prepend = () => {
    const label = pool[(nextId - 4) % pool.length];
    const newItem = { id: nextId, label };
    const next = [newItem, ...items];
    // index-keyed: every position's content changed → all touched
    setTouchedIndex(new Set(next.map((_, i) => i)));
    // id-keyed: only the newly inserted node is touched
    setTouchedId(new Set([newItem.id]));
    setItems(next);
    setNextId((n) => n + 1);
    setOpKey((k) => k + 1);
  };

  const reset = () => {
    setItems(initial);
    setNextId(4);
    setOpKey(0);
    setTouchedIndex(new Set());
    setTouchedId(new Set());
  };

  return (
    <LessonLayout slug="keys">
      <Section>
        <p>
          <T k="lessons.keys.intro1" />
        </p>
        <p>
          <T k="lessons.keys.intro2" />
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="primary" icon={<PlusOutlined />} onClick={prepend}>
          {t("lessons.keys.addToTop")}
        </Button>
        <Button icon={<ReloadOutlined />} onClick={reset}>
          {t("lessons.keys.reset")}
        </Button>
        <Segmented<KeyMode>
          value={highlight}
          onChange={setHighlight}
          options={[
            { label: t("lessons.keys.focusIndex"), value: "index" },
            { label: t("lessons.keys.focusId"), value: "id" },
          ]}
          className="ml-auto [&>.ant-segmented-group]:gap-3"
        />
      </div>

      <AnimationStage minH={300}>
        <div className="grid h-full min-w-0 grid-cols-2 gap-3 sm:gap-6">
          <div
            className={
              highlight === "index"
                ? "rounded-xl ring-1 ring-warn/40 p-2"
                : "p-2 opacity-70"
            }
          >
            <List
              items={items}
              mode="index"
              touched={touchedIndex}
              opKey={opKey}
            />
          </div>
          <div
            className={
              highlight === "id"
                ? "rounded-xl ring-1 ring-ok/40 p-2"
                : "p-2 opacity-70"
            }
          >
            <List items={items} mode="id" touched={touchedId} opKey={opKey} />
          </div>
        </div>
      </AnimationStage>

      <Legend>
        <LegendItem
          color="var(--color-warn)"
          label={t("lessons.keys.legendUpdate")}
        />
        <LegendItem
          color="var(--color-ok)"
          label={t("lessons.keys.legendReuse")}
        />
      </Legend>

      <CodeBlock
        code={`// ❌ index as key — breaks on insert/reorder
{items.map((item, i) => <Row key={i} {...item} />)}

// ✅ stable id as key — React matches rows correctly
{items.map((item) => <Row key={item.id} {...item} />)}`}
      />

      <Callout kind="warn" title={t("lessons.keys.calloutTitle")}>
        <T k="lessons.keys.calloutBody" />
      </Callout>
    </LessonLayout>
  );
}
