/**
 * Register Page - Presentation Layer
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { usePageTitle } from '@/app/router/AppRouter'

export default function RegisterPage(): JSX.Element {
  usePageTitle('Registrieren')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Registrieren</h2>
          <p className="text-muted-foreground mt-2">Neues Konto erstellen</p>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vorname</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholder="Max"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nachname</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholder="Mustermann"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">E-Mail</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="max@example.com"
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
              Registrieren
            </button>
          </form>
          
          <div className="text-center mt-4">
            <Link to={ROUTES.LOGIN} className="text-sm text-muted-foreground hover:text-foreground">
              Bereits ein Konto? Anmelden
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
