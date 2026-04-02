import { generateThreatRules } from './mockData'
import type { ThreatRule, UpdateThreatRuleInput } from './types'

const threatRulesStore: ThreatRule[] = [...generateThreatRules()]

const MIN_DELAY_MS = 300
const MAX_DELAY_MS = 700
/** Small fraction of calls fail to exercise error UI without dominating UX. */
const SIMULATED_FAILURE_RATE = 0.02

function delayMs(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
}

function abortError(): DOMException {
  return new DOMException('The operation was aborted.', 'AbortError')
}

/**
 * Promise-based delay that rejects when `signal` aborts, mirroring fetch adapters.
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }
    const id = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      window.clearTimeout(id)
      signal?.removeEventListener('abort', onAbort)
      reject(abortError())
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

async function simulateLatency(signal?: AbortSignal): Promise<void> {
  await sleep(delayMs(), signal)
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw abortError()
}

function maybeThrowSimulatedError(): void {
  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new Error('Simulated network error')
  }
}

export async function getThreatRules(signal?: AbortSignal): Promise<ThreatRule[]> {
  await simulateLatency(signal)
  throwIfAborted(signal)
  maybeThrowSimulatedError()
  return [...threatRulesStore]
}

export async function getThreatRuleById(id: string, signal?: AbortSignal): Promise<ThreatRule> {
  await simulateLatency(signal)
  throwIfAborted(signal)
  maybeThrowSimulatedError()
  const rule = threatRulesStore.find((r) => r.id === id)
  if (!rule) throw new Error(`Threat rule not found: ${id}`)
  return { ...rule, tags: [...rule.tags] }
}

export async function updateThreatRule(input: UpdateThreatRuleInput): Promise<ThreatRule> {
  await simulateLatency()
  maybeThrowSimulatedError()
  const idx = threatRulesStore.findIndex((r) => r.id === input.id)
  if (idx === -1) throw new Error(`Threat rule not found: ${input.id}`)

  const current = threatRulesStore[idx]!
  const next: ThreatRule = {
    ...current,
    ...(input.status !== undefined && { status: input.status }),
    ...(input.threshold !== undefined && { threshold: input.threshold }),
    ...(input.owner !== undefined && { owner: input.owner }),
    updatedAt: new Date().toISOString(),
  }
  threatRulesStore[idx] = next
  return { ...next, tags: [...next.tags] }
}
