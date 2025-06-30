/**
 * App Provider - Application Layer
 * Diese Komponente kombiniert alle Provider für die Anwendung
 */

import React from 'react'
import { DependencyProvider, Dependencies } from './DependencyProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from './ErrorBoundary'
import { Toaster } from 'sonner'

interface AppProviderProps {
  readonly children: React.ReactNode
  readonly dependencyOverrides?: Partial<Dependencies>
}

export function AppProvider({ children, dependencyOverrides }: AppProviderProps): JSX.Element {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('App-weiter Fehler:', error, errorInfo)
        // Hier könnte Error-Tracking integriert werden
      }}
    >
      <DependencyProvider overrides={dependencyOverrides}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          {children}
          
          {/* Toast-Notifications */}
          <Toaster
            richColors
            position="top-right"
            expand={true}
            toastOptions={{
              duration: 4000,
              className: 'toast',
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </DependencyProvider>
    </ErrorBoundary>
  )
}

// Hook für globale App-Funktionen
export function useApp() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const [isVisible, setIsVisible] = React.useState(!document.hidden)

  // Online/Offline-Status überwachen
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Tab-Sichtbarkeit überwachen
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return {
    isOnline,
    isVisible,
  }
}

// Performance-Monitor-Hook
export function usePerformanceMonitor() {
  React.useEffect(() => {
    // Web Vitals Monitoring
    if ('web-vital' in window) {
      // Hier würde Web Vitals-Tracking implementiert werden
    }

    // Performance Observer für LCP, FID, CLS
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('Performance Entry:', entry)
          // Hier würde Performance-Tracking implementiert werden
        })
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] })

      return () => observer.disconnect()
    }
    
    return undefined
  }, [])
}

// Global Error Handler für unbehandelte Promises
export function useGlobalErrorHandler() {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unbehandelte Promise-Rejection:', event.reason)
      // Hier könnte Error-Reporting implementiert werden
      event.preventDefault() // Verhindert Browser-Standard-Verhalten
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Globaler JavaScript-Fehler:', event.error)
      // Hier könnte Error-Reporting implementiert werden
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])
}

// Service Worker Hook
export function useServiceWorker() {
  const [swRegistration, setSwRegistration] = React.useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(false)

  React.useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker Registrierung fehlgeschlagen:', error)
        })
    }
  }, [])

  const updateApp = React.useCallback(() => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }, [swRegistration])

  return {
    swRegistration,
    updateAvailable,
    updateApp,
  }
}

// App-Initialisierung Hook
export function useAppInitialization() {
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [initError, setInitError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        // Hier würden App-Initialisierungsschritte ausgeführt werden:
        // - User-Session wiederherstellen
        // - Feature-Flags laden
        // - Konfiguration laden
        // - Caches warmlaufen lassen
        
        await new Promise(resolve => setTimeout(resolve, 100)) // Simuliere Initialisierung
        
        setIsInitialized(true)
      } catch (error) {
        setInitError(error instanceof Error ? error : new Error('App-Initialisierung fehlgeschlagen'))
      }
    }

    initializeApp()
  }, [])

  return {
    isInitialized,
    initError,
  }
}

// Debug-Informationen für Entwicklung
export function useDebugInfo() {
  return React.useMemo(() => {
    if (import.meta.env.DEV) {
      return {
        env: import.meta.env.MODE,
        version: import.meta.env.PACKAGE_VERSION || '1.0.0',
        buildTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      }
    }
    return null
  }, [])
}

// Hot Module Replacement für Entwicklung
if (import.meta.hot) {
  import.meta.hot.accept()
}
