/**
 * Not Found Page - Presentation Layer
 * Diese Komponente wird angezeigt, wenn eine Route nicht gefunden wird
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { usePageTitle } from '@/app/router/AppRouter'

export default function NotFoundPage(): JSX.Element {
  usePageTitle('Seite nicht gefunden')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-bold mb-2">Seite nicht gefunden</h2>
          <p className="text-muted-foreground">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Zur Startseite
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link to={ROUTES.ABOUT} className="text-muted-foreground hover:text-foreground">
              Über uns
            </Link>
            <Link to={ROUTES.USERS} className="text-muted-foreground hover:text-foreground">
              Benutzer
            </Link>
            <Link to={ROUTES.DASHBOARD} className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
