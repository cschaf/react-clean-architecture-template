/**
 * Users Page - Presentation Layer
 * Diese Komponente zeigt eine Liste aller Benutzer an
 */

import React from 'react'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'

export default function UsersPage(): JSX.Element {
  usePageTitle('Benutzer')

  return (
    <PageContainer
      title="Benutzer"
      subtitle="Verwalten Sie Benutzerkonten und Berechtigungen"
    >
      <div className="bg-card rounded-lg border p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Benutzerverwaltung</h3>
        <p className="text-muted-foreground mb-4">
          Diese Seite würde eine vollständige Benutzerverwaltung mit CRUD-Operationen enthalten.
        </p>
        <p className="text-sm text-muted-foreground">
          Implementierung folgt in der vollständigen Template-Version.
        </p>
      </div>
    </PageContainer>
  )
}
