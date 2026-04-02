export type ThreatRuleSeverity = 'low' | 'medium' | 'high' | 'critical'

export type ThreatRuleStatus = 'enabled' | 'disabled'

export type ThreatRuleSource = 'email' | 'browser' | 'identity' | 'endpoint' | 'network'

export type ThreatRule = {
  id: string
  name: string
  description: string
  source: ThreatRuleSource
  severity: ThreatRuleSeverity
  status: ThreatRuleStatus
  threshold: number
  createdAt: string
  updatedAt: string
  owner: string | null
  tags: string[]
  lastTriggeredAt: string | null
}

export type UpdateThreatRuleInput = {
  id: string
  status?: ThreatRuleStatus
  threshold?: number
  owner?: string | null
}
