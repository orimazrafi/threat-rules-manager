import { memo } from 'react'
import type { ThreatRule } from '../types'

export type SelectedThreatRulePreviewProps = {
  rule: ThreatRule | null
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export const SelectedThreatRulePreview = memo(function SelectedThreatRulePreview({
  rule,
}: SelectedThreatRulePreviewProps) {
  if (!rule) {
    return (
      <aside className="selected-threat-rule-preview" aria-label="Selected rule">
        <p className="selected-threat-rule-preview__empty">Select a rule to see details.</p>
      </aside>
    )
  }

  return (
    <aside className="selected-threat-rule-preview" aria-label="Selected rule details">
      <h2 className="selected-threat-rule-preview__title">{rule.name}</h2>
      <dl className="selected-threat-rule-preview__dl">
        <dt>ID</dt>
        <dd>{rule.id}</dd>
        <dt>Severity</dt>
        <dd>{rule.severity}</dd>
        <dt>Source</dt>
        <dd>{rule.source}</dd>
        <dt>Status</dt>
        <dd>{rule.status}</dd>
        <dt>Threshold</dt>
        <dd>{rule.threshold}</dd>
        <dt>Owner</dt>
        <dd>{rule.owner ?? '—'}</dd>
        <dt>Created</dt>
        <dd>{formatDate(rule.createdAt)}</dd>
        <dt>Updated</dt>
        <dd>{formatDate(rule.updatedAt)}</dd>
        <dt>Last triggered</dt>
        <dd>{formatDate(rule.lastTriggeredAt)}</dd>
        <dt>Tags</dt>
        <dd>{rule.tags.length ? rule.tags.join(', ') : '—'}</dd>
        <dt>Description</dt>
        <dd className="selected-threat-rule-preview__description">{rule.description}</dd>
      </dl>
    </aside>
  )
})
