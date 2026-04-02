import { useThreatRules } from '../features/threat-rules'

export function HomePage() {
  const { data, isPending, isError, error, refetch } = useThreatRules()

  return (
    <div className="home-page">
      <h1 className="home-page__title">FrameOps Threat Rules Manager</h1>

      <section className="threat-rules-debug" aria-label="Threat rules data debug">
        <h2 className="threat-rules-debug__title">Rules feed (temporary)</h2>
        {isPending && <p className="threat-rules-debug__state">Loading rules…</p>}
        {isError && (
          <div className="threat-rules-debug__state threat-rules-debug__state--error">
            <p>{error instanceof Error ? error.message : 'Failed to load rules'}</p>
            <button type="button" className="threat-rules-debug__retry" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}
        {!isPending && !isError && data && (
          <>
            <p className="threat-rules-debug__count">Total rules: {data.length}</p>
            <ol className="threat-rules-debug__list">
              {data.slice(0, 5).map((rule) => (
                <li key={rule.id}>{rule.name}</li>
              ))}
            </ol>
          </>
        )}
      </section>
    </div>
  )
}
