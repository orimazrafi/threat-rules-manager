import type {
  ThreatRule,
  ThreatRuleSeverity,
  ThreatRuleSource,
  ThreatRuleStatus,
} from './types'

const RULE_COUNT = 1_200

const SOURCES: ThreatRuleSource[] = [
  'email',
  'browser',
  'identity',
  'endpoint',
  'network',
]

const SEVERITIES: ThreatRuleSeverity[] = ['low', 'medium', 'high', 'critical']

const NAME_PREFIXES = [
  'Suspicious',
  'Anomalous',
  'High-risk',
  'Repeated',
  'Unusual',
  'Policy',
  'Credential',
  'Lateral',
  'Data exfil',
  'Phishing',
  'Malware',
  'Privilege',
  'Shadow',
  'Zero-day',
  'Insider',
]

const NAME_SUBJECTS = [
  'login pattern',
  'file access',
  'DNS query',
  'email attachment',
  'USB activity',
  'OAuth grant',
  'VPN session',
  'admin action',
  'registry change',
  'PowerShell',
  'browser extension',
  'API call volume',
  'MFA bypass attempt',
  'password spray',
  'C2 beaconing',
]

const DESCRIPTION_TEMPLATES = [
  'Flags {subject} when {metric} exceeds {threshold} within the evaluation window.',
  'Correlates {subject} with known IOCs and raises an alert at severity {severity}.',
  'Detects {subject} inconsistent with the user’s baseline; tune threshold per tenant.',
  'Matches {subject} against FrameOps curated intel; review false positives quarterly.',
  'Surfaces {subject} that may indicate compromise; pairs with identity risk scoring.',
]

const TAG_POOL = [
  'soc',
  'ir',
  'compliance',
  'pci',
  'hipaa',
  'identity',
  'email-security',
  'edr',
  'ueba',
  'intel',
  'automation',
  'tuning',
  'staging',
  'prod',
  'critical-assets',
]

const OWNERS = [
  'A. Okonkwo',
  'M. Singh',
  'J. Rivera',
  'K. Nielsen',
  'T. Hwang',
  'R. Patel',
  'L. Müller',
  'S. Chen',
  null,
  null,
]

/** Deterministic PRNG in [0, 1) for stable, reproducible mock rows. */
function mulberry32(seed: number): () => number {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!
}

function pickManyUnique<T>(rng: () => number, items: readonly T[], count: number): T[] {
  const copy = [...items]
  const out: T[] = []
  const n = Math.min(count, copy.length)
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * copy.length)
    out.push(copy.splice(idx, 1)[0]!)
  }
  return out
}

function formatRuleId(index: number): string {
  return `thr-${String(index).padStart(5, '0')}`
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function buildThreatRule(index: number, now: Date): ThreatRule {
  const rng = mulberry32(index * 1_039 + 42)

  const prefix = pick(rng, NAME_PREFIXES)
  const subject = pick(rng, NAME_SUBJECTS)
  const name = `${prefix} ${subject}`

  const template = pick(rng, DESCRIPTION_TEMPLATES)
  const severity = pick(rng, SEVERITIES)
  const description = template
    .replace('{subject}', subject)
    .replace('{metric}', pick(rng, ['events/min', 'bytes out', 'failed auth', 'unique destinations']))
    .replace('{threshold}', String(10 + Math.floor(rng() * 90)))
    .replace('{severity}', severity)

  const source = pick(rng, SOURCES)
  const status: ThreatRuleStatus = rng() < 0.82 ? 'enabled' : 'disabled'

  const nowMs = now.getTime()
  const ageDays = 30 + Math.floor(rng() * 400)
  const createdMs = nowMs - ageDays * MS_PER_DAY - Math.floor(rng() * 6 * 60 * 60 * 1000)
  const maxUpdateOffset = Math.min(nowMs - createdMs, 60 * MS_PER_DAY)
  const updatedMs = createdMs + Math.floor(rng() * Math.max(0, maxUpdateOffset))
  const createdAt = new Date(createdMs).toISOString()
  const updatedAt = new Date(updatedMs).toISOString()
  const createdDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)

  const threshold = 1 + Math.floor(rng() * 99)
  const tagCount = 1 + Math.floor(rng() * 4)
  const tags = pickManyUnique(rng, TAG_POOL, tagCount).sort()

  let lastTriggeredAt: string | null = null
  if (status === 'enabled' && rng() < 0.72) {
    const windowStart = updatedAtDate.getTime()
    const windowEnd = nowMs
    if (windowEnd > windowStart) {
      const offset = windowStart + Math.floor(rng() * (windowEnd - windowStart))
      const t = new Date(offset)
      if (t >= createdDate) lastTriggeredAt = t.toISOString()
    }
  }

  const owner = pick(rng, OWNERS)

  return {
    id: formatRuleId(index),
    name,
    description,
    source,
    severity,
    status,
    threshold,
    createdAt,
    updatedAt,
    owner,
    tags,
    lastTriggeredAt,
  }
}

export function generateThreatRules(count: number = RULE_COUNT): ThreatRule[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => buildThreatRule(i, now))
}

export const DEFAULT_MOCK_RULE_COUNT = RULE_COUNT
