import ShikiHighlighter from 'react-shiki'

interface Props {
  code: string
  language?: string
  /** 1-based line numbers to visually highlight */
  highlightLines?: number[]
  showLineNumbers?: boolean
  className?: string
}

/**
 * Syntax-highlighted code with Shiki, themed to match the app. Optionally
 * highlights a set of lines (used by lessons to point at the "active" code).
 */
export default function CodeBlock({
  code,
  language = 'tsx',
  highlightLines,
  showLineNumbers = false,
  className = '',
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--color-border)] text-[12px] leading-relaxed sm:text-[13.5px] [&_pre]:!m-0 [&_pre]:!bg-[var(--color-surface)] [&_pre]:!overflow-x-auto [&_pre]:!p-4 ${className}`}
    >
      <ShikiHighlighter
        language={language}
        theme="one-dark-pro"
        showLanguage={false}
        addDefaultStyles={false}
        showLineNumbers={showLineNumbers}
        highlightLineNumbers={highlightLines}
        style={{ background: 'var(--color-surface)' }}
      >
        {code.trim()}
      </ShikiHighlighter>
    </div>
  )
}
