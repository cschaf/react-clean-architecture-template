/**
 * App Router - Application Layer
 * Diese Komponente definiert das Routing für die gesamte Anwendung
 */

import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { MainLayout } from '@/presentation/layouts/MainLayout'
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'

// Lazy Loading für bessere Performance
const HomePage = React.lazy(() => import('@/presentation/pages/HomePage'))
const AboutPage = React.lazy(() => import('@/presentation/pages/AboutPage'))
const UsersPage = React.lazy(() => import('@/presentation/pages/UsersPage'))
const UserDetailPage = React.lazy(() => import('@/presentation/pages/UserDetailPage'))
const DashboardPage = React.lazy(() => import('@/presentation/pages/DashboardPage'))
const SettingsPage = React.lazy(() => import('@/presentation/pages/SettingsPage'))
const LoginPage = React.lazy(() => import('@/presentation/pages/LoginPage'))
const RegisterPage = React.lazy(() => import('@/presentation/pages/RegisterPage'))
const NotFoundPage = React.lazy(() => import('@/presentation/pages/NotFoundPage'))

// Route-Guard-Komponenten
interface ProtectedRouteProps {
  readonly children: React.ReactNode
  readonly requiresAuth?: boolean
  readonly requiredRoles?: string[]
}

function ProtectedRoute({ children, requiresAuth = false, requiredRoles = [] }: ProtectedRouteProps): JSX.Element {
  // Hier würde normalerweise die Authentifizierung geprüft werden
  const isAuthenticated = false // TODO: Aus Auth-Context oder Store holen
  const userRoles: string[] = [] // TODO: Aus Auth-Context oder Store holen

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

// Layout-Wrapper für Routen
interface RouteWrapperProps {
  readonly children: React.ReactNode
  readonly useMainLayout?: boolean
}

function RouteWrapper({ children, useMainLayout = true }: RouteWrapperProps): JSX.Element {
  if (useMainLayout) {
    return <MainLayout>{children}</MainLayout>
  }
  return <>{children}</>
}

// Suspense-Wrapper mit Fallback
interface SuspenseWrapperProps {
  readonly children: React.ReactNode
  readonly fallback?: React.ReactNode
}

function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps): JSX.Element {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}

// Haupt-Router-Komponente
export function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Öffentliche Routen ohne Layout */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <SuspenseWrapper>
                <RouteWrapper useMainLayout={false}>
                  <LoginPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <SuspenseWrapper>
                <RouteWrapper useMainLayout={false}>
                  <RegisterPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />

          {/* Öffentliche Routen mit Layout */}
          <Route
            path={ROUTES.HOME}
            element={
              <SuspenseWrapper>
                <RouteWrapper>
                  <HomePage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />
          <Route
            path={ROUTES.ABOUT}
            element={
              <SuspenseWrapper>
                <RouteWrapper>
                  <AboutPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />

          {/* Benutzer-Routen */}
          <Route
            path={ROUTES.USERS}
            element={
              <SuspenseWrapper>
                <RouteWrapper>
                  <UsersPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />
          <Route
            path={ROUTES.USER_DETAIL}
            element={
              <SuspenseWrapper>
                <RouteWrapper>
                  <UserDetailPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />

          {/* Geschützte Routen */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute requiresAuth>
                <SuspenseWrapper>
                  <RouteWrapper>
                    <DashboardPage />
                  </RouteWrapper>
                </SuspenseWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute requiresAuth>
                <SuspenseWrapper>
                  <RouteWrapper>
                    <SettingsPage />
                  </RouteWrapper>
                </SuspenseWrapper>
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path={ROUTES.NOT_FOUND}
            element={
              <SuspenseWrapper>
                <RouteWrapper>
                  <NotFoundPage />
                </RouteWrapper>
              </SuspenseWrapper>
            }
          />

          {/* Catch-all für unbekannte Routen */}
          <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

// Route-Konfiguration für programmatische Navigation
export const routes = {
  home: () => ROUTES.HOME,
  about: () => ROUTES.ABOUT,
  users: () => ROUTES.USERS,
  userDetail: (id: string) => ROUTES.USER_DETAIL.replace(':id', id),
  dashboard: () => ROUTES.DASHBOARD,
  settings: () => ROUTES.SETTINGS,
  login: () => ROUTES.LOGIN,
  register: () => ROUTES.REGISTER,
  notFound: () => ROUTES.NOT_FOUND,
} as const

// Hook für Navigation
export function useAppNavigation() {
  const navigate = React.useCallback((to: string, options?: { replace?: boolean }) => {
    // Hier könnten zusätzliche Navigation-Guards oder Analytics hinzugefügt werden
    const routerNavigate = React.useContext(NavigationContext)
    if (routerNavigate) {
      routerNavigate(to, options)
    }
  }, [])

  return { navigate, routes }
}

// Navigation Context (vereinfacht)
const NavigationContext = React.createContext<
  ((to: string, options?: { replace?: boolean }) => void) | null
>(null)

// Breadcrumb-Unterstützung
export interface BreadcrumbItem {
  readonly label: string
  readonly path?: string
  readonly isActive?: boolean
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = React.useContext(LocationContext)
  
  if (!location) return []

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: ROUTES.HOME }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: isLast ? undefined : currentPath,
      isActive: isLast,
    })
  })

  return breadcrumbs
}

// Location Context für Breadcrumbs
const LocationContext = React.createContext<{ pathname: string } | null>(null)

// Meta-Titel-Management
export function usePageTitle(title: string, deps: React.DependencyList = []) {
  React.useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | React Clean Architecture`
    
    return () => {
      document.title = previousTitle
    }
  }, [title, ...deps])
}

// Route-Preloading für bessere Performance
export function preloadRoute(routePath: string) {
  // Hier würde Code-Splitting mit Preloading implementiert werden
  console.log(`Preloading route: ${routePath}`)
}
