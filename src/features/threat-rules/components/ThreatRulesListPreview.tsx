import { memo } from 'react'
import type { ThreatRule } from '../types'

export type ThreatRulesListPreviewProps = {
  rules: ThreatRule[]
  selectedRuleId: string | null
  onSelectRuleId: (id: string) => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export const ThreatRulesListPreview = memo(function ThreatRulesListPreview({
  rules,
  selectedRuleId,
  onSelectRuleId,
}: ThreatRulesListPreviewProps) {
  return (
    <div className="threat-rules-list-preview">
      <table className="threat-rules-list-preview__table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Severity</th>
            <th scope="col">Source</th>
            <th scope="col">Status</th>
            <th scope="col">Owner</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            const selected = rule.id === selectedRuleId
            return (
              <tr
                key={rule.id}
                className={selected ? 'threat-rules-list-preview__row is-selected' : 'threat-rules-list-preview__row'}
                onClick={() => onSelectRuleId(rule.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectRuleId(rule.id)
                  }
                }}
                tabIndex={0}
                aria-label={`Rule ${rule.name}`}
              >
                <td>{rule.id}</td>
                <td>{rule.name}</td>
                <td>{rule.severity}</td>
                <td>{rule.source}</td>
                <td>{rule.status}</td>
                <td>{rule.owner ?? '—'}</td>
                <td>{formatDate(rule.updatedAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})
