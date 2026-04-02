import type { ThreatRule } from '../types'

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

export type ThreatRuleDetailsContentProps = {
  rule: ThreatRule
}

export function ThreatRuleDetailsContent({ rule }: ThreatRuleDetailsContentProps) {
  return (
    <div className="threat-rule-details-content">
      <section className="threat-rule-details-content__section" aria-labelledby="threat-rule-details-summary">
        <h3 id="threat-rule-details-summary" className="threat-rule-details-content__section-title">
          Summary
        </h3>
        <dl className="threat-rule-details-content__dl">
          <dt>Name</dt>
          <dd>{rule.name}</dd>
          <dt>Description</dt>
          <dd className="threat-rule-details-content__description">{rule.description}</dd>
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
        </dl>
      </section>

      <section className="threat-rule-details-content__section" aria-labelledby="threat-rule-details-tags">
        <h3 id="threat-rule-details-tags" className="threat-rule-details-content__section-title">
          Tags
        </h3>
        <p className="threat-rule-details-content__tags">
          {rule.tags.length ? rule.tags.join(', ') : '—'}
        </p>
      </section>

      <section className="threat-rule-details-content__section" aria-labelledby="threat-rule-details-meta">
        <h3 id="threat-rule-details-meta" className="threat-rule-details-content__section-title">
          Activity
        </h3>
        <dl className="threat-rule-details-content__dl">
          <dt>Created</dt>
          <dd>{formatDate(rule.createdAt)}</dd>
          <dt>Updated</dt>
          <dd>{formatDate(rule.updatedAt)}</dd>
          <dt>Last triggered</dt>
          <dd>{formatDate(rule.lastTriggeredAt)}</dd>
          <dt>Rule ID</dt>
          <dd className="threat-rule-details-content__mono">{rule.id}</dd>
        </dl>
      </section>
    </div>
  )
}
