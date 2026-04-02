import { useMemo, useState } from 'react'
import { MOCK_CURRENT_USER } from '../constants'
import type { ThreatRule, ThreatRuleStatus, UpdateThreatRuleInput } from '../types'

export type ThreatRuleActionsProps = {
  rule: ThreatRule
  isSaving: boolean
  saveError: Error | null
  onDismissSaveError: () => void
  onRetrySave: () => void
  canRetrySave: boolean
  onApplyUpdate: (input: UpdateThreatRuleInput) => void
}

function parseThreshold(raw: string): number | null {
  const n = Number(raw)
  return Number.isFinite(n) && Number.isInteger(n) ? n : null
}

export function ThreatRuleActions({
  rule,
  isSaving,
  saveError,
  onDismissSaveError,
  onRetrySave,
  canRetrySave,
  onApplyUpdate,
}: ThreatRuleActionsProps) {
  const [thresholdInput, setThresholdInput] = useState(() => String(rule.threshold))

  const parsedThreshold = useMemo(() => parseThreshold(thresholdInput.trim()), [thresholdInput])
  const thresholdDirty = parsedThreshold !== null && parsedThreshold !== rule.threshold
  const thresholdValid = parsedThreshold !== null
  const nextStatus: ThreatRuleStatus = rule.status === 'enabled' ? 'disabled' : 'enabled'

  return (
    <div className="threat-rule-actions">
      <h3 className="threat-rule-actions__title">Actions</h3>

      {isSaving && (
        <p className="threat-rule-actions__saving" role="status" aria-live="polite">
          Saving…
        </p>
      )}

      <div className="threat-rule-actions__group">
        <span className="threat-rule-actions__label">Status</span>
        <button
          type="button"
          className="threat-rule-actions__button"
          disabled={isSaving}
          onClick={() => onApplyUpdate({ id: rule.id, status: nextStatus })}
        >
          {rule.status === 'enabled' ? 'Disable rule' : 'Enable rule'}
        </button>
      </div>

      <div className="threat-rule-actions__group">
        <label className="threat-rule-actions__label" htmlFor={`threshold-${rule.id}`}>
          Threshold
        </label>
        <div className="threat-rule-actions__threshold-row">
          <input
            id={`threshold-${rule.id}`}
            type="number"
            className="threat-rule-actions__input"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            disabled={isSaving}
            min={1}
            max={99}
            step={1}
            aria-invalid={thresholdInput.trim() !== '' && !thresholdValid}
          />
          <button
            type="button"
            className="threat-rule-actions__button"
            disabled={isSaving || !thresholdDirty || !thresholdValid}
            onClick={() => {
              if (parsedThreshold === null) return
              onApplyUpdate({ id: rule.id, threshold: parsedThreshold })
            }}
          >
            Save threshold
          </button>
        </div>
        {!thresholdValid && thresholdInput.trim() !== '' && (
          <p className="threat-rule-actions__hint">Enter a whole number (e.g. 1–99).</p>
        )}
      </div>

      <div className="threat-rule-actions__group">
        <span className="threat-rule-actions__label">Ownership</span>
        <button
          type="button"
          className="threat-rule-actions__button"
          disabled={isSaving || rule.owner === MOCK_CURRENT_USER}
          onClick={() => onApplyUpdate({ id: rule.id, owner: MOCK_CURRENT_USER })}
        >
          Assign to me
        </button>
        <p className="threat-rule-actions__hint">Mock user: {MOCK_CURRENT_USER}</p>
      </div>

      {saveError && (
        <div className="threat-rule-actions__error" role="alert">
          <p className="threat-rule-actions__error-message">{saveError.message}</p>
          <div className="threat-rule-actions__error-actions">
            {canRetrySave && (
              <button
                type="button"
                className="threat-rule-actions__button"
                disabled={isSaving}
                onClick={onRetrySave}
              >
                Retry
              </button>
            )}
            <button
              type="button"
              className="threat-rule-actions__button-secondary"
              disabled={isSaving}
              onClick={onDismissSaveError}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
