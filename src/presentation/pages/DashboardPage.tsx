/**
 * Dashboard Page - Presentation Layer
 */

import React from 'react'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'

export default function DashboardPage(): JSX.Element {
  usePageTitle('Dashboard')

  return (
    <PageContainer title="Dashboard" subtitle="Übersicht über Ihre Anwendung">
      <div className="bg-card rounded-lg border p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
        <p className="text-muted-foreground">Hier würden Metriken und Übersichten angezeigt.</p>
      </div>
    </PageContainer>
  )
}
