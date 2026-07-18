import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type LessonGroup = 'JavaScript' | 'React Rendering' | 'React Hooks'

export interface LessonMeta {
  slug: string
  title: string
  tagline: string
  group: LessonGroup
  /** lazy component loader */
  load: () => Promise<{ default: ComponentType }>
  /**
   * The lazy component, created ONCE at module scope. Creating React.lazy
   * inside render causes React to keep rendering the stale component when
   * navigating between lessons, so it must live here.
   */
  Component: LazyExoticComponent<ComponentType>
}

/**
 * The single source of truth for every lesson. Router, sidebar and the home
 * grid all read from this list, so adding a lesson is a one-line change.
 */
const lessonList: Omit<LessonMeta, 'Component'>[] = [
  {
    slug: 'event-loop',
    title: 'The JS Event Loop',
    tagline: 'Call stack, Web APIs, macro & micro task queues — animated.',
    group: 'JavaScript',
    load: () => import('./event-loop/EventLoopLesson'),
  },
  {
    slug: 'virtual-dom',
    title: 'Virtual DOM',
    tagline: 'How JSX becomes a lightweight tree React can reason about.',
    group: 'React Rendering',
    load: () => import('./virtual-dom/VirtualDomLesson'),
  },
  {
    slug: 'reconciliation',
    title: 'Reconciliation & Diffing',
    tagline: 'Comparing two virtual trees to find the minimal change.',
    group: 'React Rendering',
    load: () => import('./reconciliation/ReconciliationLesson'),
  },
  {
    slug: 'keys',
    title: 'The Role of Keys',
    tagline: 'Why keys make list diffing correct and cheap.',
    group: 'React Rendering',
    load: () => import('./keys/KeysLesson'),
  },
  {
    slug: 'commit',
    title: 'Committing to the Real DOM',
    tagline: 'Only the changed node is touched in the actual DOM.',
    group: 'React Rendering',
    load: () => import('./commit/CommitLesson'),
  },
  {
    slug: 'state-render',
    title: 'State → Re-render',
    tagline: 'How setState kicks off render, diff and commit.',
    group: 'React Hooks',
    load: () => import('./state-render/StateRenderLesson'),
  },
  {
    slug: 'usestate-vs-useref',
    title: 'useState vs useRef',
    tagline: 'One re-renders, one quietly remembers.',
    group: 'React Hooks',
    load: () => import('./usestate-vs-useref/StateVsRefLesson'),
  },
  {
    slug: 'usecallback',
    title: 'useCallback',
    tagline: 'Keeping a function identity stable across renders.',
    group: 'React Hooks',
    load: () => import('./usecallback/UseCallbackLesson'),
  },
  {
    slug: 'usememo',
    title: 'useMemo',
    tagline: 'Caching an expensive computation between renders.',
    group: 'React Hooks',
    load: () => import('./usememo/UseMemoLesson'),
  },
  {
    slug: 'react-memo',
    title: 'React.memo',
    tagline: 'Skip a child render when its props did not change.',
    group: 'React Hooks',
    load: () => import('./react-memo/ReactMemoLesson'),
  },
  {
    slug: 'effect-vs-layouteffect',
    title: 'useEffect vs useLayoutEffect',
    tagline: 'Timing relative to the browser paint.',
    group: 'React Hooks',
    load: () => import('./effects/EffectsLesson'),
  },
  {
    slug: 'prop-drilling',
    title: 'Prop Drilling & Context',
    tagline: 'Threading a prop through layers — and how Context skips them.',
    group: 'React Hooks',
    load: () => import('./prop-drilling/PropDrillingLesson'),
  },
  {
    slug: 'hoc',
    title: 'Higher-Order Components',
    tagline: 'A function that wraps a component to add behavior.',
    group: 'React Hooks',
    load: () => import('./hoc/HocLesson'),
  },
]

// Attach a module-scope lazy component to each lesson.
export const lessons: LessonMeta[] = lessonList.map((l) => ({
  ...l,
  Component: lazy(l.load),
}))

export const lessonBySlug = (slug: string) =>
  lessons.find((l) => l.slug === slug)

export const lessonGroups: LessonGroup[] = [
  'JavaScript',
  'React Rendering',
  'React Hooks',
]
