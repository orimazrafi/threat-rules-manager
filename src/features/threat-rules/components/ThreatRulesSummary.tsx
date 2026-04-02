import { memo } from 'react'

export type ThreatRulesSummaryProps = {
  totalCount: number
  visibleCount: number
}

export const ThreatRulesSummary = memo(function ThreatRulesSummary({
  totalCount,
  visibleCount,
}: ThreatRulesSummaryProps) {
  return (
    <div className="threat-rules-summary" role="status">
      <span>
        <strong>{totalCount}</strong> total rules
      </span>
      <span className="threat-rules-summary__sep" aria-hidden>
        ·
      </span>
      <span>
        <strong>{visibleCount}</strong> visible
      </span>
    </div>
  )
})
