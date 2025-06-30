/**
 * Loading Spinner - UI Component
 * Diese Komponente zeigt einen Lade-Indikator an
 */

import React from 'react'
import { cn } from '@/shared/utils'

interface LoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg' | 'xl'
  readonly className?: string
  readonly text?: string
  readonly overlay?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  overlay = false 
}: LoadingSpinnerProps): JSX.Element {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Lädt..."
      />
      {text && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Inline Loading Spinner für kleinere Bereiche
interface InlineLoadingProps {
  readonly size?: 'sm' | 'md'
  readonly className?: string
}

export function InlineLoading({ size = 'sm', className }: InlineLoadingProps): JSX.Element {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Lädt..."
    />
  )
}

// Skeleton Loading für Content-Platzhalter
interface SkeletonProps {
  readonly className?: string
  readonly variant?: 'text' | 'circular' | 'rectangular'
  readonly width?: string | number
  readonly height?: string | number
  readonly lines?: number
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: SkeletonProps): JSX.Element {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses[variant],
              i === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4'
            )}
            style={i === 0 ? style : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant === 'text' ? 'h-4' : '',
        className
      )}
      style={style}
    />
  )
}

// Loading State Hook
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)

  const startLoading = React.useCallback(() => setIsLoading(true), [])
  const stopLoading = React.useCallback(() => setIsLoading(false), [])
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading
  }
}

// Loading Wrapper für asynchrone Operationen
interface LoadingWrapperProps {
  readonly children: React.ReactNode
  readonly isLoading: boolean
  readonly fallback?: React.ReactNode
  readonly overlay?: boolean
}

export function LoadingWrapper({ 
  children, 
  isLoading, 
  fallback,
  overlay = false 
}: LoadingWrapperProps): JSX.Element {
  if (isLoading) {
    return (
      <>{fallback || <LoadingSpinner overlay={overlay} />}</>
    )
  }

  return <>{children}</>
}

// Suspenase-ähnlicher Loading-Container
interface SuspenseLoadingProps {
  readonly children: React.ReactNode
  readonly loading: boolean
  readonly error?: Error | null
  readonly retry?: () => void
  readonly fallback?: React.ReactNode
  readonly errorFallback?: (error: Error, retry?: () => void) => React.ReactNode
}

export function SuspenseLoading({
  children,
  loading,
  error,
  retry,
  fallback,
  errorFallback
}: SuspenseLoadingProps): JSX.Element {
  if (error) {
    if (errorFallback) {
      return <>{errorFallback(error, retry)}</>
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-destructive mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">Fehler beim Laden</h3>
          <p className="text-muted-foreground mt-1">{error.message}</p>
        </div>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Erneut versuchen
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return <>{fallback || <LoadingSpinner text="Lädt..." />}</>
  }

  return <>{children}</>
}

// Progress Bar für länger dauernde Operationen
interface ProgressBarProps {
  readonly value: number
  readonly max?: number
  readonly className?: string
  readonly showPercentage?: boolean
  readonly label?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showPercentage = false,
  label 
}: ProgressBarProps): JSX.Element {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
