/**
 * App Component - Application Entry Point
 * Diese Komponente ist der Haupteinstiegspunkt der Anwendung
 */

import { default as React } from 'react'
import { AppProvider } from '@/app/providers/AppProvider'
import { AppRouter } from '@/app/router/AppRouter'
import './index.css'

function App(): JSX.Element {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

export default App
