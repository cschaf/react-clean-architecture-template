/**
 * Login Page - Presentation Layer
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { usePageTitle } from '@/app/router/AppRouter'

export default function LoginPage(): JSX.Element {
  usePageTitle('Anmelden')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Anmelden</h2>
          <p className="text-muted-foreground mt-2">Bei Ihrem Konto anmelden</p>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-Mail</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="ihre@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Passwort</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90"
            >
              Anmelden
            </button>
          </form>
          
          <div className="text-center mt-4">
            <Link to={ROUTES.REGISTER} className="text-sm text-muted-foreground hover:text-foreground">
              Noch kein Konto? Registrieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
