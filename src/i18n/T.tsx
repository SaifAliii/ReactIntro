import { Trans, useTranslation } from 'react-i18next'
import type { ReactElement } from 'react'

/**
 * Shared inline-markup map for translated rich text. Translation strings can
 * use these tags, e.g. "the <strong>event loop</strong> uses a <code>queue</code>".
 */
const richComponents: Record<string, ReactElement> = {
  strong: <strong className="text-[var(--color-ink)]" />,
  em: <em />,
  code: <code />,
  br: <br />,
}

interface Props {
  /** translation key */
  k: string
  /** interpolation values */
  values?: Record<string, unknown>
}

/**
 * Renders a translated string that may contain the inline tags above.
 * Use for any user-facing copy with embedded <strong>/<code>/<em>.
 */
export default function T({ k, values }: Props) {
  return <Trans i18nKey={k} values={values} components={richComponents} />
}

/** Convenience hook returning the plain-string translator `t`. */
export function useT() {
  const { t } = useTranslation()
  return t
}
