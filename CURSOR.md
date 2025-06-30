# Cursor IDE AI Integration Guide

## Projekt-Setup für Cursor AI

Dieses React Clean Architecture Template ist optimiert für die Zusammenarbeit mit Cursor IDE's AI-Features. Verwende diese Anweisungen für maximale Produktivität.

## Cursor Rules (.cursorrules)

Erstelle eine `.cursorrules` Datei im Projekt-Root:

```
# React Clean Architecture Template - Cursor AI Rules

## Architektur-Prinzipien
- Strikte Clean Architecture Layer-Trennung
- SOLID-Prinzipien in allen Implementierungen  
- Dependency Injection über React Context
- Result Pattern für explizites Error Handling
- Immutable Entities mit Factory Methods

## Layer Dependencies (Zwingend einhalten!)
- presentation/ → domain/ (erlaubt)
- infrastructure/ → domain/ (erlaubt) 
- app/ → alle layers (erlaubt)
- domain/ → shared/ (nur shared erlaubt)
- NIEMALS: domain/ → infrastructure/ (verboten!)
- NIEMALS: domain/ → presentation/ (verboten!)

## TypeScript Standards
- Strict mode aktiviert, kein 'any' verwenden
- Readonly Properties für alle Props/Interfaces
- Result<T, E> für alle async Operations
- Zod für Runtime-Validierung
- Explizite Typisierung, keine Type-Inference bei komplexen Objekten

## Import Regeln
- Verwende Path Aliases: @/domain, @/infrastructure, @/presentation, @/app, @/shared
- Barrel Exports (index.ts) für saubere Imports
- Relative Imports nur innerhalb des gleichen Unterordners

## Code Patterns
- Entities: Immutable mit static create() und fromPersistence()
- Use Cases: Constructor Injection + async execute() Method
- Repositories: Interface in domain/, Implementation in infrastructure/
- Components: Smart (mit Use Cases) vs Dumb (nur UI)
- Hooks: useXxxUseCase() für Dependency Access

## Testing
- Jest + Vitest für Unit Tests
- React Testing Library für Component Tests  
- Mock all external dependencies
- Test file naming: ComponentName.test.tsx
- Test location: tests/unit/ für Domain Logic, tests/integration/ für API
```

## Cursor Composer Prompts

### 1. Neue Feature implementieren

```markdown
@Codebase 

Implementiere ein neues Feature für [FEATURE_NAME] mit vollständiger Clean Architecture:

**Anforderungen:**
- [Detaillierte Anforderungen hier]

**Zu erstellende Dateien:**
1. Domain Entity: `src/domain/entities/[Entity].ts`
2. Repository Interface: `src/domain/repositories/[Entity]Repository.ts`  
3. Use Cases: `src/domain/use-cases/Create[Entity].ts`, `Get[Entity].ts`, etc.
4. API Repository: `src/infrastructure/api/[Entity]ApiRepository.ts`
5. React Components: Smart Component + Dumb Components in `src/presentation/`
6. Tests für alle Layer

**Architektur-Constraints:**
- Folge dem bestehenden User/Product Pattern exakt
- Keine Direct Imports zwischen Domain → Infrastructure
- Result Pattern für alle async Operations
- TypeScript strict mode, keine 'any' types
- Zod Validation für Input/Output
- Barrel Exports aktualisieren

**Styling:**
- Tailwind CSS mit bestehender Design System
- Dark/Light Mode Support
- Responsive Design
- Accessibility (ARIA labels)

Implementiere Schritt für Schritt und erkläre deine Entscheidungen.
```

### 2. Bug Fix und Debugging

```markdown
@Codebase

Analysiere und behebe den folgenden Bug:

**Problem:** [Beschreibung des Problems]
**Fehler-Details:** [Stack Trace oder Fehlermeldung]
**Erwartetes Verhalten:** [Was sollte passieren]

**Debug-Schritte:**
1. Identifiziere die Root Cause
2. Prüfe Layer-Dependencies (Domain darf nicht Infrastructure importieren)
3. Validiere TypeScript-Typen
4. Überprüfe Result Pattern Usage
5. Teste Error Handling

**Fix-Anforderungen:**
- Minimale Änderungen, maximale Stabilität
- Bestehende Tests dürfen nicht brechen
- Neue Tests für Fix hinzufügen
- Clean Architecture Prinzipien einhalten

Zeige vor/nach Code-Vergleich und erkläre den Fix.
```

### 3. Code Refactoring

```markdown
@Codebase

Refactore die folgenden Dateien für bessere Clean Architecture:

**Zu refactorende Dateien:**
- [Liste der Dateien]

**Refactoring-Ziele:**
1. Verbessere Layer-Separation
2. Extrahiere Business Logic in Domain Layer
3. Implementiere Missing Repository Pattern
4. Reduziere Code Duplication
5. Verbessere TypeScript-Typen
6. Optimiere Performance

**Constraints:**
- Keine Breaking Changes an Public APIs
- Bestehende Tests müssen weiterhin funktionieren
- Schrittweise Migration möglich
- Documentation Updates erforderlich

Zeige Refactoring-Plan und implementiere Schritt für Schritt.
```

### 4. Test-Implementation

```markdown
@Codebase

Implementiere umfassende Tests für [Component/Feature]:

**Test-Coverage Ziele:**
- Unit Tests: Domain Entities + Use Cases
- Integration Tests: Repository Implementations  
- Component Tests: React Components + Hooks
- E2E Tests: Critical User Flows

**Test-Standards:**
- Jest + Vitest für Business Logic
- React Testing Library für UI
- Mock Strategy: Mock externe Dependencies
- Test Data: Factory Pattern für Test Objects
- Coverage: Minimum 80% Code Coverage

**Spezifische Tests:**
1. Entity Business Rules Validation
2. Use Case Error Handling
3. Repository API Mapping
4. Component User Interactions
5. Integration zwischen Layern

Implementiere Tests mit aussagekräftigen Namen und dokumentiere Edge Cases.
```

## Cursor Chat Optimierungen

### Kontext-Setup für bessere AI-Antworten

```markdown
Dieses Projekt verwendet Clean Architecture mit diesen Layers:

**Domain Layer** (`src/domain/`):
- Entities: Geschäftsobjekte mit Validierung und Business Rules
- Use Cases: Anwendungsfälle mit Dependency Injection
- Repository Interfaces: Abstrakte Datenzugriffsdefinitionen

**Infrastructure Layer** (`src/infrastructure/`):
- API Clients: HTTP-Kommunikation und Repository-Implementierungen  
- Storage Services: LocalStorage, SessionStorage Wrapper
- External Services: E-Mail, Authentifizierung, etc.

**Presentation Layer** (`src/presentation/`):
- Components: Smart (mit Use Cases) vs Dumb (nur UI)
- Pages: Vollständige Seitenkomponenten mit Routing
- Layouts: Wiederverwendbare Layout-Container

**Application Layer** (`src/app/`):
- Providers: Dependency Injection Container
- Router: Route-Konfiguration mit Lazy Loading
- Store: Globaler State (falls erforderlich)

**Coding Standards:**
- TypeScript strict mode
- Result Pattern: `Result<T, E> = { success: true, data: T } | { success: false, error: E }`
- Immutable Entities mit Factory Methods
- Dependency Injection über React Context
- Path Aliases für Clean Imports
```

### Spezifische Cursor Commands

#### Entity Generator
```markdown
/generate entity [EntityName] with these properties:
- [property1]: [type] - [description]
- [property2]: [type] - [description]

Include:
- Factory methods (create, fromPersistence)
- Business validation rules
- Computed properties
- Immutable update methods
- TypeScript interfaces
```

#### Use Case Generator  
```markdown
/generate use-case [ActionName] for [EntityName] with:
- Dependencies: [Repository], [Service]
- Input: [describe input structure]
- Business Rules: [list constraints]
- Side Effects: [list additional operations]
- Error Handling: [specific error types]

Follow Result Pattern and include comprehensive error handling.
```

#### Component Generator
```markdown
/generate component [ComponentName] as [smart|dumb]:
- Props: [list required props]
- State: [if smart component]
- Use Cases: [if smart component]
- Events: [user interactions]
- Styling: Tailwind CSS with dark mode
- Accessibility: ARIA labels and semantic HTML
```

#### Test Generator
```markdown
/generate tests for [ClassName] covering:
- Happy path scenarios
- Error conditions
- Edge cases
- Business rule validation
- Mock setup for dependencies

Use Jest/Vitest with React Testing Library patterns.
```

## Code-Templates für schnelle Entwicklung

### Domain Entity Template
```typescript
// Trigger: "entity" + Tab
export class ${1:EntityName} implements BaseEntity {
  private constructor(private readonly props: ${1:EntityName}Props) {
    this.validateBusinessRules()
  }

  public static create(props: Create${1:EntityName}Props): ${1:EntityName} {
    return new ${1:EntityName}({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public static fromPersistence(props: ${1:EntityName}Props): ${1:EntityName} {
    return new ${1:EntityName}(props)
  }

  public update${2:Property}(${3:param}: ${4:type}): ${1:EntityName} {
    return new ${1:EntityName}({
      ...this.props,
      ${3:param},
      updatedAt: new Date(),
    })
  }

  public get ${5:property}(): ${6:type} {
    return ${7:computation}
  }

  private validateBusinessRules(): void {
    ${8:// Business validation logic}
  }
}
```

### Use Case Template
```typescript
// Trigger: "usecase" + Tab
export class ${1:ActionName}UseCase {
  constructor(
    private readonly ${2:repository}: ${3:Repository},
    private readonly ${4:service}?: ${5:Service}
  ) {}

  public async execute(input: ${1:ActionName}Input): Promise<Result<${1:ActionName}Output>> {
    try {
      // 1. Input validation
      ${6:// Validation logic}

      // 2. Business rules
      ${7:// Business rules check}

      // 3. Core operation
      ${8:// Main business logic}

      // 4. Side effects
      ${9:// Fire and forget operations}

      return { success: true, data: ${10:result} }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      }
    }
  }
}
```

### Smart Component Template
```typescript
// Trigger: "smartcomp" + Tab
export function ${1:ComponentName}Page(): JSX.Element {
  const ${2:useCase} = use${3:UseCase}()
  
  const [${4:state}, set${5:State}] = useState<${6:Type}[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handle${7:Action} = useCallback(async (${8:param}: ${9:Type}) => {
    const result = await ${2:useCase}.execute(${8:param})
    
    if (result.success) {
      ${10:// Handle success}
    } else {
      setError(result.error.message)
    }
  }, [${2:useCase}])

  useEffect(() => {
    ${11:// Load initial data}
  }, [])

  return (
    <PageContainer title="${12:Title}">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <${13:ViewComponent} 
          ${4:state}={${4:state}}
          on${7:Action}={handle${7:Action}}
        />
      )}
    </PageContainer>
  )
}
```

## Debugging mit Cursor

### Console Debugging
```typescript
// Verwende diese Patterns für bessere Debug-Ausgaben:
console.log('🔍 Domain Entity Created:', { 
  entity: user.toDebugString(),
  timestamp: new Date().toISOString()
})

console.log('⚡ Use Case Execution:', {
  useCase: 'CreateUserUseCase',
  input: input,
  result: result.success ? 'SUCCESS' : 'FAILED',
  error: result.success ? null : result.error.message
})

console.log('🌐 API Call:', {
  method: 'GET',
  url: `/users/${id}`,
  response: response.status,
  data: response.data ? 'PRESENT' : 'NULL'
})
```

### Error Boundary Integration
```typescript
// Verwende für bessere Error-Tracking:
export function EnhancedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled Error:', {
        message: event.error?.message,
        stack: event.error?.stack,
        component: 'Unknown',
        timestamp: new Date().toISOString()
      })
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (error) {
    return <ErrorFallback error={error} resetError={() => setError(null)} />
  }

  return <>{children}</>
}
```

## Performance-Optimierung mit Cursor

### Bundle Analysis
```bash
# Verwende diese Commands für Bundle-Analyse:
pnpm build
pnpm run analyze  # Wenn bundle-analyzer konfiguriert

# Oder mit Cursor Terminal:
npx vite build --analyze
```

### Lazy Loading Patterns
```typescript
// Cursor erkennt diese Performance-Patterns:
const LazyPage = React.lazy(() => 
  import('@/presentation/pages/SomePage').then(module => ({
    default: module.SomePage
  }))
)

// Code Splitting für große Dependencies:
const heavyLibrary = React.lazy(() => import('heavy-library'))

// Route-based Code Splitting:
const routes = [
  {
    path: '/users',
    component: React.lazy(() => import('@/presentation/pages/UsersPage'))
  }
]
```

---

**Cursor AI ist darauf optimiert, diese Patterns zu erkennen und entsprechende Vorschläge zu machen. Verwende aussagekräftige Kommentare und folge den etablierten Konventionen für beste Ergebnisse.**