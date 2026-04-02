export const threatRulesKeys = {
  all: ['threat-rules'] as const,
  lists: () => [...threatRulesKeys.all, 'list'] as const,
  details: () => [...threatRulesKeys.all, 'detail'] as const,
  detail: (id: string) => [...threatRulesKeys.details(), id] as const,
}
