import { useQuery } from '@tanstack/react-query'
import { getThreatRules } from '../api'
import { threatRulesKeys } from '../queryKeys'

export function useThreatRules() {
  return useQuery({
    queryKey: threatRulesKeys.lists(),
    queryFn: ({ signal }) => getThreatRules(signal),
  })
}
