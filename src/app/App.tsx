import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Providers } from './providers'
import { AppRouter } from './router'

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppRouter />
      </Providers>
    </ErrorBoundary>
  )
}

export default App
