import { useState } from 'react'
import { useThreatRule } from '../hooks/useThreatRule'
import { useUpdateThreatRule } from '../hooks/useUpdateThreatRule'
import type { UpdateThreatRuleInput } from '../types'
import { ThreatRuleActions } from './ThreatRuleActions'
import { ThreatRuleDetailsContent } from './ThreatRuleDetailsContent'

export type ThreatRuleDetailsPanelProps = {
  ruleId: string | null
}

function ThreatRuleDetailsSkeleton() {
  return (
    <div className="threat-rule-details-panel__skeleton" aria-busy="true" aria-label="Loading rule details">
      <div className="threat-rule-details-panel__skeleton-line threat-rule-details-panel__skeleton-line--title" />
      <div className="threat-rule-details-panel__skeleton-line" />
      <div className="threat-rule-details-panel__skeleton-line" />
      <div className="threat-rule-details-panel__skeleton-line threat-rule-details-panel__skeleton-line--short" />
      <div className="threat-rule-details-panel__skeleton-line" />
      <div className="threat-rule-details-panel__skeleton-line threat-rule-details-panel__skeleton-line--short" />
    </div>
  )
}

export function ThreatRuleDetailsPanel({ ruleId }: ThreatRuleDetailsPanelProps) {
  const detailQuery = useThreatRule(ruleId ?? undefined)
  const updateMutation = useUpdateThreatRule()
  const [lastAttempt, setLastAttempt] = useState<UpdateThreatRuleInput | null>(null)

  if (!ruleId) {
    return (
      <aside className="threat-rule-details-panel" aria-label="Rule details">
        <div className="threat-rule-details-panel__empty">
          <p>Select a rule in the table to view details and make updates.</p>
        </div>
      </aside>
    )
  }

  if (detailQuery.isPending) {
    return (
      <aside className="threat-rule-details-panel" aria-label="Rule details">
        <ThreatRuleDetailsSkeleton />
      </aside>
    )
  }

  if (detailQuery.isError) {
    return (
      <aside className="threat-rule-details-panel" aria-label="Rule details">
        <div className="threat-rule-details-panel__error">
          <p className="threat-rule-details-panel__error-title">Could not load this rule.</p>
          <p className="threat-rule-details-panel__error-message">
            {detailQuery.error instanceof Error ? detailQuery.error.message : 'Something went wrong.'}
          </p>
          <button type="button" className="threat-rule-details-panel__retry" onClick={() => detailQuery.refetch()}>
            Retry
          </button>
        </div>
      </aside>
    )
  }

  const rule = detailQuery.data
  if (!rule) {
    return null
  }

  const applyUpdate = (input: UpdateThreatRuleInput) => {
    setLastAttempt(input)
    updateMutation.mutate(input, {
      onSuccess: () => setLastAttempt(null),
    })
  }

  const saveError = updateMutation.error instanceof Error ? updateMutation.error : null

  return (
    <aside className="threat-rule-details-panel" aria-label={`Rule details: ${rule.name}`}>
      <header className="threat-rule-details-panel__header">
        <h2 className="threat-rule-details-panel__title">Rule details</h2>
        <p className="threat-rule-details-panel__subtitle">{rule.name}</p>
      </header>

      <ThreatRuleDetailsContent rule={rule} />

      <ThreatRuleActions
        key={`${rule.id}-${rule.updatedAt}`}
        rule={rule}
        isSaving={updateMutation.isPending}
        saveError={saveError}
        onDismissSaveError={() => {
          setLastAttempt(null)
          updateMutation.reset()
        }}
        onRetrySave={() => {
          if (lastAttempt) applyUpdate(lastAttempt)
        }}
        canRetrySave={Boolean(lastAttempt)}
        onApplyUpdate={applyUpdate}
      />
    </aside>
  )
}
