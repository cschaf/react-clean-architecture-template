/**
 * Error Boundary - Application Layer
 * Diese Komponente fängt JavaScript-Fehler in der Komponenten-Hierarchie ab
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { DomainError, ValidationError, NotFoundError, UnauthorizedError } from '@/shared/types'

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error: Error | null
  readonly errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Rufe den Error-Handler auf, falls vorhanden
    this.props.onError?.(error, errorInfo)

    // Logge den Fehler für Debugging
    this.logError(error, errorInfo)
  }

  private logError(error: Error, errorInfo: ErrorInfo): void {
    console.group('🚨 Error Boundary Fehler')
    console.error('Fehler:', error)
    console.error('Komponenten-Stack:', errorInfo.componentStack)
    console.error('Error-Boundary-Stack:', error.stack)
    console.groupEnd()

    // In Produktion: An Error-Tracking-Service senden
    if (import.meta.env.PROD) {
      this.reportErrorToService(error, errorInfo)
    }
  }

  private reportErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // Hier würde ein Error-Tracking-Service wie Sentry integriert werden
    try {
      // Beispiel für Error-Reporting
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: this.getUserId(),
      }

      // Mock-Implementation für Error-Reporting
      console.log('Error würde an Service gesendet:', errorData)
    } catch (reportingError) {
      console.error('Fehler beim Reporting:', reportingError)
    }
  }

  private getUserId(): string | null {
    // Hole User-ID aus localStorage oder Context
    try {
      const userToken = localStorage.getItem('app_user_token')
      if (userToken) {
        // Parse JWT oder hole aus anderem Storage
        return 'user_id_placeholder'
      }
    } catch {
      // Ignore storage errors
    }
    return null
  }

  private retry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private getErrorType(error: Error): string {
    if (error instanceof DomainError) return 'Domain-Fehler'
    if (error instanceof ValidationError) return 'Validierungsfehler'
    if (error instanceof NotFoundError) return 'Nicht-gefunden-Fehler'
    if (error instanceof UnauthorizedError) return 'Autorisierungsfehler'
    if (error instanceof TypeError) return 'Typ-Fehler'
    if (error instanceof ReferenceError) return 'Referenz-Fehler'
    return 'Unbekannter Fehler'
  }

  private getErrorMessage(error: Error): string {
    if (error instanceof DomainError) {
      return error.message
    }
    
    if (import.meta.env.DEV) {
      return error.message
    }
    
    // In Produktion: Benutzerfreundliche Nachrichten
    if (error instanceof TypeError) {
      return 'Es ist ein technischer Fehler aufgetreten.'
    }
    
    return 'Ein unerwarteter Fehler ist aufgetreten.'
  }

  public render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Verwende Custom-Fallback falls vorhanden
      if (this.props.fallback && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.retry)
      }

      // Standard-Fallback-UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorType={this.getErrorType(this.state.error)}
          errorMessage={this.getErrorMessage(this.state.error)}
          onRetry={this.retry}
          isDevelopment={import.meta.env.DEV}
        />
      )
    }

    return this.props.children
  }
}

// Standard-Fallback-Komponente
interface DefaultErrorFallbackProps {
  readonly error: Error
  readonly errorType: string
  readonly errorMessage: string
  readonly onRetry: () => void
  readonly isDevelopment: boolean
}

function DefaultErrorFallback({
  error,
  errorType,
  errorMessage,
  onRetry,
  isDevelopment,
}: DefaultErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
          Etwas ist schiefgelaufen
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {errorMessage}
        </p>
        
        {isDevelopment && (
          <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
              Entwickler-Details ({errorType})
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>Nachricht:</strong>
                <div className="font-mono text-xs bg-gray-200 dark:bg-gray-600 p-2 rounded mt-1">
                  {error.message}
                </div>
              </div>
              <div>
                <strong>Stack:</strong>
                <div className="font-mono text-xs bg-gray-200 dark:bg-gray-600 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                  {error.stack}
                </div>
              </div>
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Erneut versuchen
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Seite neu laden
          </button>
        </div>
        
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  )
}

// Hook für programmatische Error-Behandlung
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { handleError, clearError }
}

// HOC für Error Boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Async Error Boundary für Promise-Rejections
export function useAsyncErrorBoundary() {
  const { handleError } = useErrorHandler()

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(event.reason))
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [handleError])

  return handleError
}
