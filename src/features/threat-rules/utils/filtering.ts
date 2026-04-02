import type { ThreatRule, ThreatRulesToolbarFilters } from '../types'

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

/**
 * Each whitespace-separated token must appear in at least one searchable field.
 */
export function matchesSearch(rule: ThreatRule, rawQuery: string): boolean {
  const query = normalize(rawQuery)
  if (!query) return true

  const tokens = query.split(/\s+/).filter(Boolean)
  const haystacks = [
    rule.name,
    rule.description,
    rule.owner ?? '',
    rule.tags.join(' '),
  ].map((s) => s.toLowerCase())

  return tokens.every((token) => haystacks.some((h) => h.includes(token)))
}

export function matchesFilters(rule: ThreatRule, filters: ThreatRulesToolbarFilters): boolean {
  if (filters.severity !== 'all' && rule.severity !== filters.severity) return false
  if (filters.source !== 'all' && rule.source !== filters.source) return false
  if (filters.status !== 'all' && rule.status !== filters.status) return false
  return true
}
