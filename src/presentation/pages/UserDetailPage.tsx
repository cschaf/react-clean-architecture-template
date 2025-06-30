/**
 * User Detail Page - Presentation Layer
 */

import React from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'

export default function UserDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  usePageTitle(`Benutzer ${id}`)

  return (
    <PageContainer title={`Benutzer Details`} subtitle={`Benutzer ID: ${id}`}>
      <div className="bg-card rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">Benutzer-Details für ID: {id}</p>
      </div>
    </PageContainer>
  )
}
