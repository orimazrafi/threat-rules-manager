import { useQuery } from '@tanstack/react-query'
import { getThreatRuleById } from '../api'
import { threatRulesKeys } from '../queryKeys'

export function useThreatRule(ruleId: string | undefined) {
  return useQuery({
    queryKey: ruleId
      ? threatRulesKeys.detail(ruleId)
      : ([...threatRulesKeys.all, 'detail', 'idle'] as const),
    queryFn: () => getThreatRuleById(ruleId!),
    enabled: Boolean(ruleId),
  })
}
