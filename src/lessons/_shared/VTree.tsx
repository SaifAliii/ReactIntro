import { AnimatePresence, motion } from 'framer-motion'

export type NodeStatus =
  | 'same'
  | 'add'
  | 'remove'
  | 'update'
  | 'move'
  | 'active'

export interface VNode {
  id: string
  tag: string
  text?: string
  /** a single illustrative prop, e.g. className="active" */
  prop?: string
  keyLabel?: string
  status?: NodeStatus
  children?: VNode[]
}

export const statusColor: Record<NodeStatus, string> = {
  same: 'var(--color-border)',
  add: 'var(--color-ok)',
  remove: 'var(--color-warn)',
  update: 'var(--color-webapi)',
  move: 'var(--color-brand-2)',
  active: 'var(--color-brand)',
}

const statusLabel: Partial<Record<NodeStatus, string>> = {
  add: 'added',
  remove: 'removed',
  update: 'changed',
  move: 'moved',
}

function NodeBox({ node }: { node: VNode }) {
  const status = node.status ?? 'same'
  const color = statusColor[status]
  const tag = statusLabel[status]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: status === 'remove' ? 0.45 : 1,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[12.5px] whitespace-nowrap"
      style={{
        borderColor: color,
        background: `color-mix(in srgb, ${color} 12%, var(--color-surface))`,
        boxShadow:
          status === 'same'
            ? 'none'
            : `0 0 16px color-mix(in srgb, ${color} 30%, transparent)`,
        textDecoration: status === 'remove' ? 'line-through' : 'none',
      }}
    >
      <span className="text-[var(--color-brand-2)]">&lt;{node.tag}&gt;</span>
      {node.keyLabel && (
        <span className="text-[var(--color-micro)]">key={node.keyLabel}</span>
      )}
      {node.prop && <span className="text-[var(--color-muted)]">{node.prop}</span>}
      {node.text && <span className="text-[var(--color-ink)]">{node.text}</span>}
      {tag && (
        <span
          className="ml-1 rounded px-1 text-[10px] font-semibold uppercase"
          style={{ background: color, color: '#0b0f1a' }}
        >
          {tag}
        </span>
      )}
    </motion.div>
  )
}

function TreeNode({ node }: { node: VNode }) {
  const hasChildren = node.children && node.children.length > 0
  return (
    <motion.div layout className="flex flex-col items-start">
      <NodeBox node={node} />
      {hasChildren && (
        <div className="ml-4 mt-2 flex flex-col gap-2 border-l border-dashed border-[var(--color-border)] pl-4">
          <AnimatePresence mode="popLayout">
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

/** Renders a virtual-DOM tree with per-node status coloring and layout animation. */
export default function VTree({ root }: { root: VNode | null }) {
  return (
    <div className="flex flex-col items-start">
      <AnimatePresence mode="popLayout">
        {root && <TreeNode key={root.id} node={root} />}
      </AnimatePresence>
    </div>
  )
}
