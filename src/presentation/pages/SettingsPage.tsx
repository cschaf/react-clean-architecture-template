/**
 * Settings Page - Presentation Layer
 */

import React from 'react'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'

export default function SettingsPage(): JSX.Element {
  usePageTitle('Einstellungen')

  return (
    <PageContainer title="Einstellungen" subtitle="Konfigurieren Sie Ihre Anwendung">
      <div className="bg-card rounded-lg border p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Einstellungen</h3>
        <p className="text-muted-foreground">Hier würden Konfigurationsoptionen angezeigt.</p>
      </div>
    </PageContainer>
  )
}
