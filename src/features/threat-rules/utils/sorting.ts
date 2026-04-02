import type { ThreatRule, ThreatRulesSortDirection, ThreatRulesSortKey } from '../types'

const SEVERITY_ORDER: Record<ThreatRule['severity'], number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

function compareDates(aIso: string, bIso: string): number {
  return new Date(aIso).getTime() - new Date(bIso).getTime()
}

/**
 * Comparator for two rules. Returns negative if `a` should come before `b` in ascending order.
 */
export function compareRules(
  a: ThreatRule,
  b: ThreatRule,
  sortKey: ThreatRulesSortKey,
  direction: ThreatRulesSortDirection,
): number {
  let cmp = 0
  switch (sortKey) {
    case 'name':
      cmp = compareStrings(a.name, b.name)
      break
    case 'createdAt':
      cmp = compareDates(a.createdAt, b.createdAt)
      break
    case 'updatedAt':
      cmp = compareDates(a.updatedAt, b.updatedAt)
      break
    case 'severity':
      cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      break
  }
  return direction === 'asc' ? cmp : -cmp
}
