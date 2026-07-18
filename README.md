# React Internals & the JS Event Loop — Visualized

An interactive, animated learning site that explains how JavaScript's event
loop works and how React operates under the hood. Every concept is a
step-by-step animation you can play, pause, scrub and interact with.

## Lessons

**JavaScript**

- **The JS Event Loop** — call stack, Web APIs, macrotask & microtask queues,
  animated tick-by-tick with a live `setTimeout` vs `Promise` trace.

**React Rendering**

- **Virtual DOM** — how JSX compiles to a plain JS object tree.
- **Reconciliation & Diffing** — comparing the previous and next tree to derive
  the minimal set of changes.
- **The Role of Keys** — interactive side-by-side of index keys vs stable id
  keys when a list changes.
- **Committing to the Real DOM** — render vs commit phase; only the changed node
  is mutated.

**React Hooks**

- **State → Re-render** — the trigger → render → reconcile → commit pipeline.
- **useState vs useRef** — one re-renders, one mutates silently.
- **useCallback** — stable function identity across renders.
- **useMemo** — caching an expensive computation.
- **React.memo** — skipping a child render when props are unchanged.
- **useEffect vs useLayoutEffect** — timing relative to the browser paint.
- **Prop Drilling & Context** — threading a prop through intermediate layers,
  and how Context skips them (animated, with a drilling↔Context toggle).
- **Higher-Order Components** — a function that wraps a component to add
  behavior.

## Tech stack

| Concern         | Choice                                |
| --------------- | ------------------------------------- |
| Build / dev     | Vite + React 19 + TypeScript          |
| Package manager | pnpm                                  |
| UI components   | Ant Design v6                         |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animation       | Framer Motion                         |
| Code display    | Shiki (`react-shiki`)                 |
| Routing         | React Router                          |

## Getting started

```bash
pnpm install
pnpm dev        # start the dev server (http://localhost:5173)
pnpm build      # typecheck + production build
pnpm preview    # preview the production build
```

## Project layout

```
src/
  app/            # shell, router, home page, lesson page loader
  components/     # shared primitives: LessonLayout, AnimationStage,
                  # StepControls, CodeBlock, useStepPlayer, ui helpers
  lessons/
    registry.ts   # single source of truth: every lesson's slug/title/loader
    _shared/      # VTree (virtual DOM tree renderer), RenderPulse
    <topic>/      # one folder per lesson
  theme/          # Ant Design dark theme config
  i18n/           # react-i18next setup, <T> rich-text helper, locales/en.json
  index.css       # Tailwind import + design tokens (CSS variables)
```

### Translations (i18n)

All user-facing text lives in `src/i18n/locales/en.json` (the source of truth).
Components read it with `useTranslation()`/`useT()` for plain strings and the
`<T k="..." />` helper for rich text (strings may contain `<strong>`, `<em>`,
`<code>`, `<br>` tags). Code samples in lessons are intentionally **not**
translated. To add a language, create `src/i18n/locales/<code>.json` and
register it in `src/i18n/index.ts` (`resources`); add a language switcher if you
want runtime switching.

### Adding a lesson

1. Create `src/lessons/<topic>/<Name>Lesson.tsx` using `LessonLayout`.
2. Add one entry to `src/lessons/registry.ts`.

Routing, the sidebar and the home grid update automatically.

## Notes

- `React.StrictMode` is intentionally omitted: several lessons visualize exact
  render counts, and StrictMode's dev-only double render would make those counts
  misleading.
- The theme lives in two mirrored places — CSS variables in `src/index.css`
  (`@theme`) and `src/theme/antdTheme.ts`. Update both to reskin the app.
