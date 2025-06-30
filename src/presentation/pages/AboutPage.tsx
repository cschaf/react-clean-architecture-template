/**
 * About Page - Presentation Layer
 * Diese Komponente stellt die Über-uns-Seite der Anwendung dar
 */

import React from 'react'
import { PageContainer } from '@/presentation/layouts/MainLayout'
import { usePageTitle } from '@/app/router/AppRouter'
import { APP_CONFIG } from '@/shared/constants'

export default function AboutPage(): JSX.Element {
  usePageTitle('Über uns')

  return (
    <PageContainer
      title="Über uns"
      subtitle="Erfahren Sie mehr über die Architektur und Prinzipien dieses Templates"
    >
      {/* Introduction */}
      <section className="prose dark:prose-invert max-w-none">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Clean Architecture Template</h2>
          <p className="text-muted-foreground mb-4">
            Dieses Template demonstriert die Implementierung von Clean Architecture-Prinzipien 
            in einer modernen React-Anwendung. Es zeigt, wie man Geschäftslogik, 
            Infrastruktur und Präsentation sauber voneinander trennt.
          </p>
          <p className="text-muted-foreground">
            Version: <strong>{APP_CONFIG.version}</strong> | 
            Autor: <strong>{APP_CONFIG.author}</strong>
          </p>
        </div>
      </section>

      {/* Architecture Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Architektur-Übersicht</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <ArchitectureLayer
            title="Domain Layer"
            description="Enthält die Geschäftslogik und Regeln"
            items={[
              'Entities mit Geschäftsregeln',
              'Use Cases für Anwendungsfälle',
              'Repository Interfaces',
              'Domain Events'
            ]}
            color="bg-blue-500"
          />
          <ArchitectureLayer
            title="Infrastructure Layer"
            description="Externe Abhängigkeiten und Implementierungen"
            items={[
              'API Clients',
              'Repository Implementierungen',
              'External Services',
              'Storage Services'
            ]}
            color="bg-green-500"
          />
          <ArchitectureLayer
            title="Presentation Layer"
            description="UI Komponenten und User Interface"
            items={[
              'React Komponenten',
              'Pages und Layouts',
              'Custom Hooks',
              'UI State Management'
            ]}
            color="bg-purple-500"
          />
          <ArchitectureLayer
            title="Application Layer"
            description="Anwendungskonfiguration und Provider"
            items={[
              'Dependency Injection',
              'App Provider',
              'Router Konfiguration',
              'Global State'
            ]}
            color="bg-orange-500"
          />
        </div>
      </section>

      {/* SOLID Principles */}
      <section>
        <h2 className="text-2xl font-bold mb-6">SOLID Prinzipien</h2>
        <div className="space-y-4">
          <SolidPrinciple
            letter="S"
            title="Single Responsibility Principle"
            description="Jede Klasse hat nur einen Grund zur Änderung"
            example="User Entity verwaltet nur User-spezifische Geschäftslogik"
          />
          <SolidPrinciple
            letter="O"
            title="Open/Closed Principle"
            description="Offen für Erweiterung, geschlossen für Modifikation"
            example="Repository Pattern ermöglicht verschiedene Implementierungen"
          />
          <SolidPrinciple
            letter="L"
            title="Liskov Substitution Principle"
            description="Abgeleitete Klassen müssen ihre Basisklassen ersetzen können"
            example="Verschiedene Storage-Implementierungen sind austauschbar"
          />
          <SolidPrinciple
            letter="I"
            title="Interface Segregation Principle"
            description="Clients sollten nicht von Interfaces abhängen, die sie nicht nutzen"
            example="Spezifische Repository Interfaces für verschiedene Entities"
          />
          <SolidPrinciple
            letter="D"
            title="Dependency Inversion Principle"
            description="Abhängigkeit von Abstraktionen, nicht von Konkretionen"
            example="Use Cases abhängig von Repository Interfaces, nicht Implementierungen"
          />
        </div>
      </section>

      {/* Testing Strategy */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Testing-Strategie</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TestingLayer
            title="Unit Tests"
            description="Testen isolierte Komponenten und Funktionen"
            tools={['Vitest', 'React Testing Library']}
            coverage="Domain Logic, Utils, Hooks"
          />
          <TestingLayer
            title="Integration Tests"
            description="Testen Zusammenspiel verschiedener Module"
            tools={['Vitest', 'MSW']}
            coverage="Use Cases, API Integration"
          />
          <TestingLayer
            title="E2E Tests"
            description="Testen vollständige User Journeys"
            tools={['Playwright', 'Cypress']}
            coverage="Critical User Flows"
          />
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600 dark:text-green-400">✅ Empfohlenes Vorgehen</h3>
              <ul className="space-y-2 text-sm">
                <li>• Geschäftslogik in Domain Layer isolieren</li>
                <li>• Dependency Injection für bessere Testbarkeit</li>
                <li>• Typsichere APIs mit TypeScript</li>
                <li>• Komponenten klein und fokussiert halten</li>
                <li>• Error Boundaries für robuste UI</li>
                <li>• Performance-Optimierung mit React.memo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-600 dark:text-red-400">❌ Zu vermeiden</h3>
              <ul className="space-y-2 text-sm">
                <li>• Geschäftslogik in UI-Komponenten</li>
                <li>• Direkte API-Calls in Komponenten</li>
                <li>• Enge Kopplung zwischen Layern</li>
                <li>• Große, monolithische Komponenten</li>
                <li>• Unbehandelte Fehler</li>
                <li>• Any-Types in TypeScript</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Decisions */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Technologie-Entscheidungen</h2>
        <div className="space-y-4">
          <TechDecision
            technology="React 18"
            reason="Moderne Hooks, Concurrent Features, große Community"
            alternatives="Vue.js, Angular, Svelte"
          />
          <TechDecision
            technology="TypeScript"
            reason="Typsicherheit, bessere IDE-Unterstützung, Refactoring"
            alternatives="JavaScript, Flow"
          />
          <TechDecision
            technology="Vite"
            reason="Schnelle Builds, Hot Module Replacement, moderne ES-Module"
            alternatives="Create React App, Webpack, Parcel"
          />
          <TechDecision
            technology="Tailwind CSS"
            reason="Utility-First, konsistente Design-Sprache, kleine Bundle-Größe"
            alternatives="CSS Modules, Styled Components, Emotion"
          />
          <TechDecision
            technology="Vitest"
            reason="Native ESM-Support, Vite-Integration, Jest-kompatible API"
            alternatives="Jest, Testing Library"
          />
        </div>
      </section>
    </PageContainer>
  )
}

// Architecture Layer Component
interface ArchitectureLayerProps {
  readonly title: string
  readonly description: string
  readonly items: string[]
  readonly color: string
}

function ArchitectureLayer({ title, description, items, color }: ArchitectureLayerProps): JSX.Element {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center mb-4">
        <div className={`w-4 h-4 rounded-full ${color} mr-3`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex items-center">
            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// SOLID Principle Component
interface SolidPrincipleProps {
  readonly letter: string
  readonly title: string
  readonly description: string
  readonly example: string
}

function SolidPrinciple({ letter, title, description, example }: SolidPrincipleProps): JSX.Element {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
          {letter}
        </div>
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{description}</p>
          <p className="text-sm bg-muted p-2 rounded">
            <strong>Beispiel:</strong> {example}
          </p>
        </div>
      </div>
    </div>
  )
}

// Testing Layer Component
interface TestingLayerProps {
  readonly title: string
  readonly description: string
  readonly tools: string[]
  readonly coverage: string
}

function TestingLayer({ title, description, tools, coverage }: TestingLayerProps): JSX.Element {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium">Tools:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tools.map((tool) => (
              <span key={tool} className="px-2 py-1 bg-muted rounded text-xs">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium">Abdeckung:</span>
          <p className="text-sm text-muted-foreground">{coverage}</p>
        </div>
      </div>
    </div>
  )
}

// Technology Decision Component
interface TechDecisionProps {
  readonly technology: string
  readonly reason: string
  readonly alternatives: string
}

function TechDecision({ technology, reason, alternatives }: TechDecisionProps): JSX.Element {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{technology}</h3>
        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          Gewählt
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{reason}</p>
      <p className="text-xs text-muted-foreground">
        <strong>Alternativen:</strong> {alternatives}
      </p>
    </div>
  )
}
