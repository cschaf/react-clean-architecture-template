/**
 * Home Page - Presentation Layer
 * Diese Komponente stellt die Startseite der Anwendung dar
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'
import { ROUTES, APP_CONFIG } from '@/shared/constants'
import { cn } from '@/shared/utils'

export default function HomePage(): JSX.Element {
  usePageTitle('Willkommen')

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Willkommen bei{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ein modernes React-Template mit Clean Architecture-Prinzipien, 
            TypeScript und den neuesten Entwicklungstools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Dashboard erkunden
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funktionen & Vorteile</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dieses Template bietet eine solide Grundlage für moderne React-Anwendungen 
              mit bewährten Architekturmustern und Tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🏗️"
              title="Clean Architecture"
              description="Klare Trennung von Geschäftslogik, Infrastruktur und Präsentation für bessere Wartbarkeit und Testbarkeit."
            />
            <FeatureCard
              icon="⚡"
              title="TypeScript"
              description="Vollständige Typsicherheit mit strict mode und modernen TypeScript-Features für robuste Entwicklung."
            />
            <FeatureCard
              icon="🎨"
              title="Modern UI"
              description="Responsives Design mit Tailwind CSS und einem umfassenden Komponenten-System."
            />
            <FeatureCard
              icon="🧪"
              title="Testing Ready"
              description="Vorgefertigte Test-Setup mit Vitest und React Testing Library für umfassende Testabdeckung."
            />
            <FeatureCard
              icon="🔄"
              title="State Management"
              description="Dependency Injection und saubere State-Management-Patterns für komplexe Anwendungen."
            />
            <FeatureCard
              icon="📱"
              title="PWA Ready"
              description="Progressive Web App Funktionen mit Service Worker Support und Offline-Fähigkeiten."
            />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technologie-Stack</h2>
            <p className="text-muted-foreground">
              Modernste Tools und Frameworks für optimale Entwicklererfahrung
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <TechItem name="React 18" logo="⚛️" />
            <TechItem name="TypeScript" logo="🔷" />
            <TechItem name="Vite" logo="⚡" />
            <TechItem name="Tailwind" logo="🎨" />
            <TechItem name="Vitest" logo="🧪" />
            <TechItem name="ESLint" logo="🔍" />
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Schnellstart</h2>
            <p className="text-muted-foreground">
              In wenigen Schritten zu Ihrer eigenen Anwendung
            </p>
          </div>
          
          <div className="space-y-8">
            <StepCard
              step={1}
              title="Template klonen"
              description="Laden Sie das Template herunter oder klonen Sie es von GitHub"
              code="git clone [repository-url]"
            />
            <StepCard
              step={2}
              title="Dependencies installieren"
              description="Installieren Sie alle benötigten Abhängigkeiten"
              code="pnpm install"
            />
            <StepCard
              step={3}
              title="Entwicklungsserver starten"
              description="Starten Sie den lokalen Entwicklungsserver"
              code="pnpm dev"
            />
            <StepCard
              step={4}
              title="Anpassen & Entwickeln"
              description="Beginnen Sie mit der Entwicklung Ihrer Anwendung"
              code="// Bearbeiten Sie src/App.tsx"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Bereit loszulegen?</h2>
          <p className="text-muted-foreground mb-8">
            Erkunden Sie die verschiedenen Bereiche der Anwendung und sehen Sie, 
            wie Clean Architecture in der Praxis funktioniert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.USERS}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Benutzer verwalten
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Einstellungen
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}

// Feature Card Component
interface FeatureCardProps {
  readonly icon: string
  readonly title: string
  readonly description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

// Technology Item Component
interface TechItemProps {
  readonly name: string
  readonly logo: string
}

function TechItem({ name, logo }: TechItemProps): JSX.Element {
  return (
    <div className="flex flex-col items-center p-4 bg-background rounded-lg border hover:bg-accent transition-colors">
      <div className="text-3xl mb-2">{logo}</div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

// Step Card Component
interface StepCardProps {
  readonly step: number
  readonly title: string
  readonly description: string
  readonly code: string
}

function StepCard({ step, title, description, code }: StepCardProps): JSX.Element {
  const [copied, setCopied] = React.useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {step}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{code}</code>
          </pre>
          <button
            onClick={copyCode}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-md transition-colors",
              copied
                ? "bg-green-500 text-white"
                : "bg-background hover:bg-accent border"
            )}
            title="Code kopieren"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
