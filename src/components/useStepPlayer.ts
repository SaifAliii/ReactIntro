import { useCallback, useEffect, useRef, useState } from 'react'

export interface StepPlayer {
  /** current step index, 0-based */
  step: number
  /** total number of steps */
  total: number
  isPlaying: boolean
  isFirst: boolean
  isLast: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  reset: () => void
  goTo: (i: number) => void
}

interface Options {
  /** ms between auto-advances while playing */
  interval?: number
  /** loop back to 0 after the last step instead of stopping */
  loop?: boolean
}

/**
 * A tiny state machine that drives every stepped animation in the app.
 * Handles play/pause, manual stepping and auto-advance on an interval.
 */
export function useStepPlayer(total: number, options: Options = {}): StepPlayer {
  const { interval = 1100, loop = false } = options
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  const goTo = useCallback(
    (i: number) => setStep(Math.max(0, Math.min(total - 1, i))),
    [total],
  )

  const next = useCallback(() => {
    setStep((s) => {
      if (s >= total - 1) return loop ? 0 : s
      return s + 1
    })
  }, [total, loop])

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setStep(0)
  }, [])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const toggle = useCallback(() => setIsPlaying((p) => !p), [])

  useEffect(() => {
    if (!isPlaying) {
      clear()
      return
    }
    // Stop at the end unless looping.
    if (!loop && step >= total - 1) {
      setIsPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => {
      setStep((s) => (s >= total - 1 ? (loop ? 0 : s) : s + 1))
    }, interval)
    return clear
  }, [isPlaying, step, total, interval, loop])

  return {
    step,
    total,
    isPlaying,
    isFirst: step === 0,
    isLast: step === total - 1,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    goTo,
  }
}
