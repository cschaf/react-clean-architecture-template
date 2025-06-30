# Gemini AI Integration Guide

## Projekt-Kontext

Dies ist ein React Clean Architecture Template mit strikter Layering und SOLID-Prinzipien.

## Architektur-Struktur

```
src/
├── app/                    # Application Layer - DI, Provider, Router
├── domain/                 # Domain Layer - Entities, Use Cases, Interfaces
├── infrastructure/         # Infrastructure Layer - APIs, Storage, External
├── presentation/           # Presentation Layer - Components, Pages, UI
└── shared/                 # Shared - Constants, Types, Utils, Validations
```

## Coding Standards

### Import-Strategie
- Verwende **Barrel Exports** (`index.ts` Dateien)
- Nutze **Path Aliases** für saubere Imports:
  ```typescript
  import { User } from '@/domain/entities'
  import { CreateUserUseCase } from '@/domain/use-cases'
  import { HttpClient } from '@/infrastructure/api'
  import { PageContainer } from '@/presentation/layouts'
  import { cn, formatDate } from '@/shared/utils'
  ```

### Layer-Abhängigkeiten
- **Presentation** → **Domain** (über Dependency Injection)
- **Infrastructure** → **Domain** (implementiert Interfaces)
- **Domain** → **Shared** (nur)
- **App** → alle Layer (für DI und Konfiguration)

❌ **Niemals**: `@/infrastructure` in `@/domain` importieren
❌ **Niemals**: Geschäftslogik in UI-Komponenten

### Entity-Pattern
```typescript
export class User implements BaseEntity {
  private constructor(private readonly props: UserProps) {
    // Validierung hier
  }

  public static create(props: CreateProps): User {
    return new User({ ...props, id: crypto.randomUUID(), ... })
  }

  public static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  // Getter für Properties
  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`
  }

  // Geschäftslogik-Methoden
  public updateProfile(updates: UpdateData): User {
    return new User({ ...this.props, ...updates, updatedAt: new Date() })
  }
}
```

### Use Case-Pattern
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService
  ) {}

  public async execute(input: CreateUserInput): Promise<Result<CreateUserOutput>> {
    try {
      // 1. Input validieren
      // 2. Geschäftsregeln prüfen
      // 3. Entity erstellen
      // 4. Persistieren
      // 5. Side Effects
      return { success: true, data: { user } }
    } catch (error) {
      return { success: false, error }
    }
  }
}
```

### Repository-Pattern
```typescript
// Domain Interface
export interface UserRepository {
  findById(id: string): Promise<Result<User | null>>
  save(user: User): Promise<Result<User>>
}

// Infrastructure Implementation
export class UserApiRepository implements UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async findById(id: string): Promise<Result<User | null>> {
    const response = await this.httpClient.get<UserApiData>(`/users/${id}`)
    const user = this.mapApiDataToUser(response.data)
    return { success: true, data: user }
  }
}
```

### React Component-Pattern
```typescript
// Smart Component (mit Use Cases)
export function UserListPage(): JSX.Element {
  const listUsersUseCase = useListUsersUseCase()
  const [users, setUsers] = useState<User[]>([])
  
  useEffect(() => {
    const loadUsers = async () => {
      const result = await listUsersUseCase.execute({})
      if (result.success) setUsers(result.data.users.data)
    }
    loadUsers()
  }, [])

  return (
    <PageContainer title="Benutzer">
      <UserList users={users} />
    </PageContainer>
  )
}

// Dumb Component (nur UI)
interface UserListProps {
  readonly users: User[]
}

export function UserList({ users }: UserListProps): JSX.Element {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

## TypeScript Guidelines

### Typen-Definitionen
```typescript
// Props immer readonly
interface ComponentProps {
  readonly title: string
  readonly users: readonly User[]
  readonly onSelect?: (user: User) => void
}

// Result Pattern für Error Handling
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Input/Output Typen für Use Cases
export interface CreateUserInput {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
}

export interface CreateUserOutput {
  readonly user: User
}
```

### Validation mit Zod
```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Ungültige E-Mail'),
  firstName: z.string().min(1, 'Vorname erforderlich'),
  lastName: z.string().min(1, 'Nachname erforderlich'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
```

## Testing-Patterns

### Entity Tests
```typescript
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const user = User.create({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    })
    
    expect(user.fullName).toBe('John Doe')
    expect(user.email).toBe('test@example.com')
  })

  it('should validate email format', () => {
    expect(() => User.create({
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe'
    })).toThrow(ValidationError)
  })
})
```

### Use Case Tests
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let mockRepository: jest.Mocked<UserRepository>
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    mockRepository = createMockUserRepository()
    mockEmailService = createMockEmailService()
    useCase = new CreateUserUseCase(mockRepository, mockEmailService)
  })

  it('should create user successfully', async () => {
    mockRepository.emailExists.mockResolvedValue({ success: true, data: false })
    mockRepository.save.mockResolvedValue({ success: true, data: expect.any(User) })

    const result = await useCase.execute({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    })

    expect(result.success).toBe(true)
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalled()
  })
})
```

### Component Tests
```typescript
describe('UserList', () => {
  const mockUsers = [
    User.create({ email: 'john@example.com', firstName: 'John', lastName: 'Doe' }),
    User.create({ email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' })
  ]

  it('should render user list', () => {
    render(<UserList users={mockUsers} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })
})
```

## Styling mit Tailwind CSS

### Design System
```typescript
// Verwende utility classes
<div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-2">Titel</h3>
  <p className="text-muted-foreground">Beschreibung</p>
</div>

// Verwende cn() für bedingte Klassen
<button 
  className={cn(
    'px-4 py-2 rounded-md transition-colors',
    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
    className
  )}
>
  Button
</button>
```

### Responsive Design
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Actions */}
</div>
```

## Performance Best Practices

### Lazy Loading
```typescript
const HomePage = React.lazy(() => import('@/presentation/pages/HomePage'))
const UserDetailPage = React.lazy(() => import('@/presentation/pages/UserDetailPage'))

// In Router
<Route path="/" element={
  <Suspense fallback={<LoadingSpinner />}>
    <HomePage />
  </Suspense>
} />
```

### Memoization
```typescript
// Komponenten memoizen
export const UserCard = React.memo(({ user }: { user: User }) => {
  return <div>{user.fullName}</div>
})

// Callbacks memoizen
const handleUserSelect = useCallback((user: User) => {
  navigate(`/users/${user.id}`)
}, [navigate])

// Values memoizen
const filteredUsers = useMemo(() => {
  return users.filter(user => user.fullName.includes(searchTerm))
}, [users, searchTerm])
```

## Error Handling

### Domain Errors
```typescript
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, field: string) {
    super(message, 'VALIDATION_ERROR', { field })
  }
}
```

### Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightFail />
</ErrorBoundary>
```

## AI-Prompt-Templates

### Neue Feature hinzufügen
```
Erstelle ein neues Feature für [FEATURE_NAME] mit Clean Architecture:

1. Domain Entity mit Geschäftslogik
2. Repository Interface im Domain Layer  
3. Use Cases für CRUD-Operationen
4. Repository Implementation im Infrastructure Layer
5. React Components im Presentation Layer
6. Integration in Dependency Injection
7. Tests für alle Layer

Folge dem bestehenden Pattern und verwende TypeScript strict mode.
```

### Bug Fix
```
Analysiere und behebe den Fehler in [COMPONENT/CLASS]:

1. Identifiziere die Root Cause
2. Prüfe Layer-Abhängigkeiten (keine Domain → Infrastructure)
3. Validiere TypeScript-Typen
4. Teste die Lösung
5. Folge den SOLID-Prinzipien

Code-Kontext: [BESCHREIBUNG]
```

### Refactoring
```
Refactore [COMPONENT/CLASS] für bessere Clean Architecture:

1. Extrahiere Geschäftslogik in Domain Layer
2. Implementiere Repository Pattern wenn nötig
3. Verwende Dependency Injection
4. Verbessere Typsicherheit
5. Reduziere Coupling zwischen Layern
6. Füge Tests hinzu

Aktueller Code: [CODE]
```

---

**Wichtig**: Halte immer die Clean Architecture-Prinzipien ein und verwende das Result Pattern für Error Handling. Jede neue Komponente sollte den bestehenden Patterns folgen.
