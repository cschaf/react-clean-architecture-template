/**
 * Main Layout - Presentation Layer
 * Diese Komponente definiert das Haupt-Layout der Anwendung
 */

import React from 'react'
import { Header } from '@/presentation/components/layout/Header'
import { Sidebar } from '@/presentation/components/layout/Sidebar'
import { Footer } from '@/presentation/components/layout/Footer'
import { cn } from '@/shared/utils'

interface MainLayoutProps {
  readonly children: React.ReactNode
  readonly showSidebar?: boolean
  readonly sidebarCollapsed?: boolean
  readonly className?: string
}

export function MainLayout({ 
  children, 
  showSidebar = true, 
  sidebarCollapsed = false,
  className 
}: MainLayoutProps): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!sidebarCollapsed)
  const [isMobile, setIsMobile] = React.useState(false)

  // Responsive Sidebar-Verhalten
  React.useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      {/* Header */}
      <Header 
        onToggleSidebar={showSidebar ? toggleSidebar : undefined}
        showSidebarToggle={showSidebar}
      />

      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {showSidebar && isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Seitenleiste schließen"
          />
        )}

        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            isMobile={isMobile}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main 
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out flex flex-col',
            showSidebar && isSidebarOpen && !isMobile ? 'md:ml-64' : '',
            'min-w-0' // Prevents content overflow when sidebar is open
          )}
        >
          {/* Content Area */}
          <div className="flex-1 p-4 lg:p-6">
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  )
}

// Layout-Varianten
export function FullWidthLayout({ children, className }: Pick<MainLayoutProps, 'children' | 'className'>): JSX.Element {
  return (
    <MainLayout showSidebar={false} className={className}>
      {children}
    </MainLayout>
  )
}

export function DashboardLayout({ children, className }: Pick<MainLayoutProps, 'children' | 'className'>): JSX.Element {
  return (
    <MainLayout showSidebar={true} className={className}>
      {children}
    </MainLayout>
  )
}

// Layout-Context für Layout-spezifische Funktionen
interface LayoutContextValue {
  readonly isSidebarOpen: boolean
  readonly toggleSidebar: () => void
  readonly isMobile: boolean
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null)

export function useLayout(): LayoutContextValue {
  const context = React.useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout muss innerhalb von MainLayout verwendet werden')
  }
  return context
}

// Responsive Layout Hook
export function useResponsiveLayout() {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg')

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('sm')
      else if (width < 768) setBreakpoint('md')
      else if (width < 1024) setBreakpoint('lg')
      else if (width < 1280) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'sm' || breakpoint === 'md',
    isTablet: breakpoint === 'md' || breakpoint === 'lg',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
  }
}

// Page Container für konsistente Seitenstruktur
interface PageContainerProps {
  readonly children: React.ReactNode
  readonly title?: string
  readonly subtitle?: string
  readonly actions?: React.ReactNode
  readonly breadcrumbs?: React.ReactNode
  readonly className?: string
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function PageContainer({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
  maxWidth = 'full'
}: PageContainerProps): JSX.Element {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none'
  }

  return (
    <div className={cn('space-y-6', maxWidthClasses[maxWidth], className)}>
      {/* Header Section */}
      {(title || subtitle || actions || breadcrumbs) && (
        <div className="space-y-4">
          {breadcrumbs}
          
          {(title || subtitle || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {actions && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

// Card Layout für Inhalte
interface CardLayoutProps {
  readonly children: React.ReactNode
  readonly title?: string
  readonly description?: string
  readonly actions?: React.ReactNode
  readonly className?: string
}

export function CardLayout({ children, title, description, actions, className }: CardLayoutProps): JSX.Element {
  return (
    <div className={cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)}>
      {(title || description || actions) && (
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <h3 className="text-lg font-semibold">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions}
          </div>
        </div>
      )}
      
      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  )
}
