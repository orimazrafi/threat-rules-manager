import { useCallback, useMemo, useState } from 'react'
import { SelectedThreatRulePreview } from '../features/threat-rules/components/SelectedThreatRulePreview'
import { VirtualizedThreatRulesTable } from '../features/threat-rules/components/VirtualizedThreatRulesTable'
import { ThreatRulesSummary } from '../features/threat-rules/components/ThreatRulesSummary'
import { ThreatRulesToolbar } from '../features/threat-rules/components/ThreatRulesToolbar'
import { useDebounce } from '../features/threat-rules/hooks/useDebounce'
import { useThreatRules } from '../features/threat-rules/hooks/useThreatRules'
import type {
  ThreatRuleSeverity,
  ThreatRuleSource,
  ThreatRuleStatus,
  ThreatRulesSortDirection,
  ThreatRulesSortKey,
  ThreatRulesToolbarFilters,
} from '../features/threat-rules/types'
import { matchesFilters, matchesSearch } from '../features/threat-rules/utils/filtering'
import { compareRules } from '../features/threat-rules/utils/sorting'

const DEFAULT_FILTERS: ThreatRulesToolbarFilters = {
  severity: 'all',
  source: 'all',
  status: 'all',
}

const DEFAULT_SORT_KEY: ThreatRulesSortKey = 'updatedAt'
const DEFAULT_SORT_DIRECTION: ThreatRulesSortDirection = 'desc'

export function ThreatRulesPage() {
  const { data, isPending, isError, error, refetch } = useThreatRules()

  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 300)

  const [filters, setFilters] = useState<ThreatRulesToolbarFilters>(DEFAULT_FILTERS)
  const [sortKey, setSortKey] = useState<ThreatRulesSortKey>(DEFAULT_SORT_KEY)
  const [sortDirection, setSortDirection] = useState<ThreatRulesSortDirection>(DEFAULT_SORT_DIRECTION)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)

  const visibleRules = useMemo(() => {
    if (!data?.length) return []
    const filtered = data.filter(
      (rule) => matchesFilters(rule, filters) && matchesSearch(rule, debouncedSearch),
    )
    return filtered.toSorted((a, b) => compareRules(a, b, sortKey, sortDirection))
  }, [data, debouncedSearch, filters, sortDirection, sortKey])

  const selectedRule = useMemo(() => {
    if (!data || !selectedRuleId) return null
    return data.find((r) => r.id === selectedRuleId) ?? null
  }, [data, selectedRuleId])

  const handleClearFilters = useCallback(() => {
    setSearchText('')
    setFilters(DEFAULT_FILTERS)
  }, [])

  const handleSeverityChange = useCallback((severity: ThreatRuleSeverity | 'all') => {
    setFilters((f) => ({ ...f, severity }))
  }, [])

  const handleSourceChange = useCallback((source: ThreatRuleSource | 'all') => {
    setFilters((f) => ({ ...f, source }))
  }, [])

  const handleStatusChange = useCallback((status: ThreatRuleStatus | 'all') => {
    setFilters((f) => ({ ...f, status }))
  }, [])

  if (isPending) {
    return (
      <div className="threat-rules-page">
        <h1 className="threat-rules-page__title">Threat rules</h1>
        <p className="threat-rules-page__state">Loading rules…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="threat-rules-page">
        <h1 className="threat-rules-page__title">Threat rules</h1>
        <div className="threat-rules-page__state threat-rules-page__state--error">
          <p>{error instanceof Error ? error.message : 'Failed to load rules'}</p>
          <button type="button" className="threat-rules-page__retry" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  const totalCount = data?.length ?? 0

  if (totalCount === 0) {
    return (
      <div className="threat-rules-page">
        <h1 className="threat-rules-page__title">Threat rules</h1>
        <p className="threat-rules-page__state">No rules in the catalog.</p>
      </div>
    )
  }

  return (
    <div className="threat-rules-page">
      <header className="threat-rules-page__header">
        <h1 className="threat-rules-page__title">Threat rules</h1>
      </header>

      <ThreatRulesToolbar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        severity={filters.severity}
        onSeverityChange={handleSeverityChange}
        source={filters.source}
        onSourceChange={handleSourceChange}
        status={filters.status}
        onStatusChange={handleStatusChange}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        onClearFilters={handleClearFilters}
      />

      <ThreatRulesSummary totalCount={totalCount} visibleCount={visibleRules.length} />

      <div className="threat-rules-page__layout">
        <div className="threat-rules-page__list-column">
          <VirtualizedThreatRulesTable
            data={visibleRules}
            selectedRuleId={selectedRuleId}
            onSelectRuleId={setSelectedRuleId}
          />
        </div>
        <SelectedThreatRulePreview rule={selectedRule} />
      </div>
    </div>
  )
}
