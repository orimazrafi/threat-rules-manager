import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateThreatRule } from '../api'
import { threatRulesKeys } from '../queryKeys'
import type { ThreatRule, UpdateThreatRuleInput } from '../types'

export function useUpdateThreatRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateThreatRuleInput) => updateThreatRule(input),
    onSuccess: (updated: ThreatRule) => {
      queryClient.setQueryData(threatRulesKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: threatRulesKeys.lists() })
    },
  })
}
