import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { lessons } from "@/lessons/registry";

interface Props {
  slug: string;
  children: ReactNode;
}

/**
 * Frames a lesson page: animated title block, the lesson body, and prev/next
 * navigation derived from the lesson registry order.
 */
export default function LessonLayout({ slug, children }: Props) {
  const { t } = useTranslation();
  const index = lessons.findIndex((l) => l.slug === slug);
  const meta = lessons[index];
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const title = (l: { slug: string; title: string }) =>
    t(`lessons.${l.slug}.title`, { defaultValue: l.title });

  return (
    <motion.article
      key={slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8"
    >
      <header className="mb-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-2">
          {meta && t(`groups.${meta.group}`, { defaultValue: meta.group })}
        </div>
        <h1 className="m-0 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {meta && title(meta)}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          {meta &&
            t(`lessons.${meta.slug}.tagline`, { defaultValue: meta.tagline })}
        </p>
      </header>

      <div className="space-y-8">{children}</div>

      <nav className="mt-14 flex items-stretch justify-between gap-3 border-t border-border pt-6">
        {prev ? (
          <Link to={`/lesson/${prev.slug}`} className="min-w-0 max-w-[48%]">
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              className="flex! w-full items-center"
            >
              <span className="truncate">{title(prev)}</span>
            </Button>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/lesson/${next.slug}`} className="min-w-0 max-w-[48%]">
            <Button
              type="primary"
              size="large"
              className="flex! w-full items-center"
            >
              <span className="truncate">{title(next)}</span>
              <ArrowRightOutlined />
            </Button>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </motion.article>
  );
}
