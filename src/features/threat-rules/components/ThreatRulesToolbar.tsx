import { memo } from 'react'
import type {
  ThreatRuleSeverity,
  ThreatRuleSource,
  ThreatRuleStatus,
  ThreatRulesSortDirection,
  ThreatRulesSortKey,
} from '../types'

export type ThreatRulesToolbarProps = {
  searchText: string
  onSearchTextChange: (value: string) => void
  severity: ThreatRuleSeverity | 'all'
  onSeverityChange: (value: ThreatRuleSeverity | 'all') => void
  source: ThreatRuleSource | 'all'
  onSourceChange: (value: ThreatRuleSource | 'all') => void
  status: ThreatRuleStatus | 'all'
  onStatusChange: (value: ThreatRuleStatus | 'all') => void
  sortKey: ThreatRulesSortKey
  onSortKeyChange: (value: ThreatRulesSortKey) => void
  sortDirection: ThreatRulesSortDirection
  onSortDirectionChange: (value: ThreatRulesSortDirection) => void
  onClearFilters: () => void
}

export const ThreatRulesToolbar = memo(function ThreatRulesToolbar({
  searchText,
  onSearchTextChange,
  severity,
  onSeverityChange,
  source,
  onSourceChange,
  status,
  onStatusChange,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onSortDirectionChange,
  onClearFilters,
}: ThreatRulesToolbarProps) {
  return (
    <div className="threat-rules-toolbar">
      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Search</span>
        <input
          type="search"
          className="threat-rules-toolbar__input"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Name, description, owner, tags…"
          autoComplete="off"
        />
      </label>

      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Severity</span>
        <select
          className="threat-rules-toolbar__select"
          value={severity}
          onChange={(e) => onSeverityChange(e.target.value as ThreatRuleSeverity | 'all')}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </label>

      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Source</span>
        <select
          className="threat-rules-toolbar__select"
          value={source}
          onChange={(e) => onSourceChange(e.target.value as ThreatRuleSource | 'all')}
        >
          <option value="all">All</option>
          <option value="email">Email</option>
          <option value="browser">Browser</option>
          <option value="identity">Identity</option>
          <option value="endpoint">Endpoint</option>
          <option value="network">Network</option>
        </select>
      </label>

      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Status</span>
        <select
          className="threat-rules-toolbar__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ThreatRuleStatus | 'all')}
        >
          <option value="all">All</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </label>

      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Sort by</span>
        <select
          className="threat-rules-toolbar__select"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as ThreatRulesSortKey)}
        >
          <option value="updatedAt">Updated</option>
          <option value="createdAt">Created</option>
          <option value="severity">Severity</option>
          <option value="name">Name</option>
        </select>
      </label>

      <label className="threat-rules-toolbar__field">
        <span className="threat-rules-toolbar__label">Direction</span>
        <select
          className="threat-rules-toolbar__select"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value as ThreatRulesSortDirection)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      <div className="threat-rules-toolbar__actions">
        <button type="button" className="threat-rules-toolbar__clear" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    </div>
  )
})
