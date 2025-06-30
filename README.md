# React Clean Architecture Template

Ein professionelles React-Template mit Clean Architecture-Prinzipien, TypeScript und modernen Entwicklungstools.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-yellow)

## 🏗️ Architektur-Übersicht

Dieses Template implementiert Clean Architecture-Prinzipien mit klarer Trennung von:

```
src/
├── app/                    # Application Layer
│   ├── providers/          # Dependency Injection, Theme, Error Handling
│   └── router/             # Routing-Konfiguration
├── domain/                 # Business Logic (Entities, Use Cases)
│   ├── entities/          # Geschäftsobjekte mit Regeln
│   ├── repositories/      # Repository Interfaces
│   └── use-cases/         # Anwendungsfälle
├── infrastructure/        # External Concerns (APIs, Storage)
│   ├── api/              # HTTP-Clients und Repository-Implementierungen
│   ├── external/         # Externe Services (Email, Auth)
│   └── storage/          # Lokale Speicher-Services
├── presentation/          # UI Components and Pages
│   ├── components/       # Wiederverwendbare UI-Komponenten
│   ├── layouts/          # Layout-Komponenten
│   └── pages/            # Seiten-Komponenten
└── shared/                # Shared Utilities and Types
    ├── constants/        # Anwendungsweite Konstanten
    ├── types/           # Gemeinsame TypeScript-Typen
    ├── utils/           # Utility-Funktionen
    └── validations/     # Zod-Validierungsschemas
```

## ✨ Features

- **🏗️ Clean Architecture**: Klare Trennung von Geschäftslogik, Infrastruktur und Präsentation
- **⚡ TypeScript**: Vollständige Typsicherheit mit strict mode
- **🎨 Modern UI**: Responsives Design mit Tailwind CSS und Dark/Light Mode
- **🧪 Testing Ready**: Vitest + React Testing Library Setup
- **🔄 State Management**: Dependency Injection und saubere Patterns
- **📱 PWA Ready**: Service Worker Support vorbereitet
- **🔍 Code Quality**: ESLint + Prettier Konfiguration
- **📦 Optimized Builds**: Vite für schnelle Entwicklung und Builds

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ 
- pnpm (empfohlen) oder npm/yarn

### Installation

```bash
# 1. Template klonen
git clone [repository-url]
cd react-clean-architecture-template

# 2. Dependencies installieren
pnpm install

# 3. Entwicklungsserver starten
pnpm dev

# 4. In Browser öffnen
# http://localhost:5173
```

### Verfügbare Scripts

```bash
# Entwicklung
pnpm dev              # Entwicklungsserver starten
pnpm build            # Production Build erstellen
pnpm preview          # Production Build lokal testen

# Code Quality
pnpm lint             # ESLint ausführen
pnpm lint:fix         # ESLint mit Auto-Fix
pnpm type-check       # TypeScript-Überprüfung
pnpm format           # Prettier formatieren

# Testing
pnpm test             # Unit Tests ausführen
pnpm test:ui          # Test UI öffnen
pnpm test:coverage    # Coverage Report
pnpm test:watch       # Tests im Watch-Mode
```

## 📋 Template-Anpassung

### Projekt-Setup

- [ ] Projektname in `package.json` ändern
- [ ] Autor und Beschreibung aktualisieren
- [ ] `src/shared/constants/app.ts` anpassen
- [ ] API-Endpunkte in `src/shared/constants/app.ts` konfigurieren
- [ ] Favicon und App-Icons ersetzen
- [ ] Tailwind-Theme-Farben anpassen
- [ ] AI-Instruktionsdateien überprüfen

### Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei:

```env
VITE_API_BASE_URL=https://your-api.com
VITE_APP_NAME=Ihre App
```

## 🏛️ Architektur-Prinzipien

### SOLID-Prinzipien

- **S**ingle Responsibility: Jede Klasse hat einen Grund zur Änderung
- **O**pen/Closed: Offen für Erweiterung, geschlossen für Modifikation  
- **L**iskov Substitution: Ersetzbarkeit von Implementierungen
- **I**nterface Segregation: Kleine, fokussierte Interfaces
- **D**ependency Inversion: Abhängigkeit von Abstraktionen

### Dependency Flow

```
Presentation Layer → Domain Layer ← Infrastructure Layer
```

- **Presentation** kennt Domain, aber nicht Infrastructure
- **Domain** kennt keine anderen Layer (reine Geschäftslogik)
- **Infrastructure** implementiert Domain-Interfaces

## 🧪 Testing-Strategie

### Unit Tests
- Domain-Entities und Use Cases
- Utility-Funktionen
- React Hooks

### Integration Tests  
- API-Repository-Implementierungen
- Use Case-Orchestrierung

### Component Tests
- React-Komponenten
- User-Interaktionen
- Accessibility

### Test-Beispiele

```typescript
// Domain Entity Test
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const user = User.create({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    })
    expect(user.fullName).toBe('John Doe')
  })
})

// Component Test
describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />)
    expect(screen.getByText(/Willkommen/i)).toBeInTheDocument()
  })
})
```

## 🔧 Entwicklung

### Neue Features hinzufügen

1. **Domain Layer**: Entität und Use Case erstellen
2. **Infrastructure Layer**: Repository implementieren
3. **Presentation Layer**: UI-Komponenten entwickeln
4. **App Layer**: Dependencies verknüpfen

### Code-Konventionen

- **Funktionale Komponenten** mit Hooks
- **Props-Interfaces** klar definieren
- **Barrel Exports** für saubere Imports
- **Error Boundaries** für robuste UI
- **TypeScript strict mode** verwenden

## 📚 Weitere Ressourcen

- [Clean Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [AI Integration Instructions](./docs/AI_INTEGRATION.md)

## 🤝 Contributing

Siehe [CONTRIBUTING.md](./docs/CONTRIBUTING.md) für Entwicklungsrichtlinien.

## 📄 Lizenz

MIT License - siehe [LICENSE](./LICENSE) für Details.

## 🆘 Support

- [Issues](https://github.com/your-username/react-clean-architecture-template/issues)
- [Discussions](https://github.com/your-username/react-clean-architecture-template/discussions)
- [Documentation](./docs/)

---

**Entwickelt mit ❤️ für moderne React-Entwicklung**
