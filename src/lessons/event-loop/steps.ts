export interface Frame {
  id: string
  label: string
}

export interface ELState {
  stack: Frame[]
  webapi: Frame[]
  macro: Frame[]
  micro: Frame[]
  console: string[]
  /** 1-based active line in the code sample, 0 = none */
  line: number
  note: string
  /** true while the event loop is actively draining a queue */
  looping?: boolean
}

export const eventLoopCode = `console.log('1: start')

setTimeout(() => {
  console.log('2: timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('3: promise')
})

console.log('4: end')`

const f = (id: string, label: string): Frame => ({ id, label })

// A hand-authored trace of exactly what the engine does, one observable
// moment per step. Frame ids are stable across steps so Framer Motion can
// animate a token staying put vs. moving.
export const eventLoopSteps: ELState[] = [
  {
    stack: [],
    webapi: [],
    macro: [],
    micro: [],
    console: [],
    line: 0,
    note: 'Ready. The call stack, the queues and the Web APIs are all empty.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [],
    macro: [],
    micro: [],
    console: [],
    line: 0,
    note: 'The whole script runs inside one main() frame on the call stack.',
  },
  {
    stack: [f('main', 'main()'), f('log1', "console.log('1: start')")],
    webapi: [],
    macro: [],
    micro: [],
    console: [],
    line: 1,
    note: 'console.log is synchronous — it goes straight onto the stack.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [],
    macro: [],
    micro: [],
    console: ['1: start'],
    line: 1,
    note: 'It prints immediately, then pops off the stack.',
  },
  {
    stack: [f('main', 'main()'), f('st', 'setTimeout(cb, 0)')],
    webapi: [],
    macro: [],
    micro: [],
    console: ['1: start'],
    line: 3,
    note: 'setTimeout is a Web API. Calling it hands the callback to the browser.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [f('timer', '⏱ timer 0ms → cb')],
    macro: [],
    micro: [],
    console: ['1: start'],
    line: 3,
    note: 'The browser starts the timer and setTimeout returns at once — JS never waits.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [],
    console: ['1: start'],
    line: 3,
    note: 'Even at 0 ms the callback cannot cut in line — it waits in the macrotask queue.',
  },
  {
    stack: [f('main', 'main()'), f('pt', 'Promise.then(cb)')],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [],
    console: ['1: start'],
    line: 7,
    note: 'Promise.resolve() is already fulfilled, so .then schedules a microtask.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [f('promiseCb', 'cb → log "3: promise"')],
    console: ['1: start'],
    line: 7,
    note: 'The microtask now waits in the (higher-priority) microtask queue.',
  },
  {
    stack: [f('main', 'main()'), f('log4', "console.log('4: end')")],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [f('promiseCb', 'cb → log "3: promise"')],
    console: ['1: start'],
    line: 11,
    note: 'Back to synchronous code: the last console.log runs.',
  },
  {
    stack: [f('main', 'main()')],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [f('promiseCb', 'cb → log "3: promise"')],
    console: ['1: start', '4: end'],
    line: 11,
    note: 'It prints "4: end" and pops.',
  },
  {
    stack: [],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [f('promiseCb', 'cb → log "3: promise"')],
    console: ['1: start', '4: end'],
    line: 0,
    note: 'main() returns. The stack is empty — now the event loop takes over.',
    looping: true,
  },
  {
    stack: [f('promiseCb', 'cb → log "3: promise"')],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [],
    console: ['1: start', '4: end'],
    line: 0,
    note: 'The loop drains ALL microtasks first — the promise callback runs.',
    looping: true,
  },
  {
    stack: [],
    webapi: [],
    macro: [f('timeoutCb', 'cb → log "2: timeout"')],
    micro: [],
    console: ['1: start', '4: end', '3: promise'],
    line: 0,
    note: 'It prints "3: promise". The microtask queue is now empty.',
    looping: true,
  },
  {
    stack: [f('timeoutCb', 'cb → log "2: timeout"')],
    webapi: [],
    macro: [],
    micro: [],
    console: ['1: start', '4: end', '3: promise'],
    line: 0,
    note: 'Only now does the loop take ONE macrotask — the setTimeout callback.',
    looping: true,
  },
  {
    stack: [],
    webapi: [],
    macro: [],
    micro: [],
    console: ['1: start', '4: end', '3: promise', '2: timeout'],
    line: 0,
    note: 'Final order: 1 → 4 → 3 → 2. Microtasks always beat macrotasks, even at 0 ms.',
  },
]
