import type { ColumnDef } from '@tanstack/react-table'
import type { ThreatRule } from '../types'

function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

/** Column widths shared with the virtual row grid (fixed height layout). */
export const threatRulesColumns: ColumnDef<ThreatRule>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 280,
    cell: ({ getValue }) => (
      <span className="threat-rules-virtual-table__cell-text" title={String(getValue())}>
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    size: 92,
  },
  {
    accessorKey: 'source',
    header: 'Source',
    size: 100,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 96,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    size: 128,
    cell: ({ getValue }) => {
      const v = getValue() as string | null
      return v ?? '—'
    },
  },
  {
    accessorKey: 'threshold',
    header: 'Threshold',
    size: 88,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    size: 144,
    cell: ({ getValue }) => formatUpdatedAt(getValue() as string),
  },
]

export const threatRulesGridTemplateColumns = threatRulesColumns
  .map((c) => `${typeof c.size === 'number' ? c.size : 150}px`)
  .join(' ')
