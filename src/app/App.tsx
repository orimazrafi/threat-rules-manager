import { ThreatRulesPage } from '../pages/ThreatRulesPage'
import { AppProviders } from './providers'

export default function App() {
  return (
    <AppProviders>
      <div className="app-shell">
        <main className="app-shell__main">
          <ThreatRulesPage />
        </main>
      </div>
    </AppProviders>
  )
}
