import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateThreatRule } from '../api'
import { threatRulesKeys } from '../queryKeys'
import type { ThreatRule, UpdateThreatRuleInput } from '../types'

function cloneRule(rule: ThreatRule): ThreatRule {
  return { ...rule, tags: [...rule.tags] }
}

export function useUpdateThreatRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateThreatRuleInput) => updateThreatRule(input),
    onSuccess: (updated: ThreatRule) => {
      const snapshot = cloneRule(updated)
      queryClient.setQueryData(threatRulesKeys.detail(updated.id), snapshot)
      queryClient.setQueryData<ThreatRule[]>(threatRulesKeys.lists(), (prev) => {
        if (!prev) return prev
        return prev.map((r) => (r.id === snapshot.id ? cloneRule(snapshot) : r))
      })
    },
  })
}
