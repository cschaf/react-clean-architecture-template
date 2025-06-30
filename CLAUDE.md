# Claude AI Integration Guide

## Projektübersicht

Dieses React Template implementiert Clean Architecture mit vier strikten Layern und SOLID-Prinzipien für maintainablen, testbaren Code.

## Kernarchitektur

### Layer-Hierarchie (Dependency Rule)
```
┌─────────────────────────┐
│    Presentation Layer   │ ← React Components, Pages, UI
│  (Frameworks & Drivers) │
├─────────────────────────┤
│    Application Layer    │ ← DI Container, Providers, Router
│   (Interface Adapters)  │
├─────────────────────────┤
│ Infrastructure Layer    │ ← API Clients, Storage, External Services
│   (Interface Adapters)  │
├─────────────────────────┤
│      Domain Layer       │ ← Business Logic, Entities, Use Cases
│   (Enterprise Business  │
│        Rules)           │
└─────────────────────────┘
            ↑
        Shared Layer (Types, Utils, Constants)
```

### Dependency Flow Rules
1. **Inner layers** definieren Interfaces, **Outer layers** implementieren sie
2. **Dependency Inversion**: Concrete implementations werden injiziert
3. **Isolation**: Domain Layer kennt keine anderen Layer
4. **Clean Imports**: Nur erlaubte Layer-zu-Layer Abhängigkeiten

## Development Patterns

### Entity Design Pattern
```typescript
// Immutable, Business Rule Enforcing
export class User implements BaseEntity {
  private constructor(private readonly props: UserProps) {
    // Constructor validation
    this.validateBusinessRules()
  }

  // Factory Methods
  public static create(props: CreateUserProps): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  // Immutable Updates
  public updateProfile(updates: Partial<UpdateUserProps>): User {
    return new User({
      ...this.props,
      ...updates,
      updatedAt: new Date(),
    })
  }

  // Business Logic Methods
  public canPerformAction(action: string): boolean {
    return this.isActive && this.hasPermission(action)
  }

  // Computed Properties
  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`
  }

  private validateBusinessRules(): void {
    if (!this.props.email.includes('@')) {
      throw new ValidationError('Invalid email format', 'email')
    }
  }
}
```

### Use Case Pattern (Application Business Rules)
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,      // Interface
    private readonly passwordHasher: PasswordHasher,      // Interface  
    private readonly emailService: EmailService,          // Interface
    private readonly auditLogger?: AuditLogger            // Optional Interface
  ) {}

  public async execute(input: CreateUserInput): Promise<Result<CreateUserOutput>> {
    try {
      // 1. Input Validation
      const validationResult = this.validateInput(input)
      if (!validationResult.success) return validationResult

      // 2. Business Rule Enforcement
      const emailExists = await this.userRepository.emailExists(input.email)
      if (emailExists.data) {
        return { 
          success: false, 
          error: new DomainError('Email already exists', 'EMAIL_EXISTS') 
        }
      }

      // 3. Entity Creation (Domain Logic)
      const hashedPassword = await this.passwordHasher.hash(input.password)
      const user = User.create({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      })

      // 4. Persistence
      const savedUser = await this.userRepository.save(user)
      if (!savedUser.success) return savedUser

      // 5. Side Effects (Fire and Forget)
      this.executeAsyncSideEffects(user)

      return { success: true, data: { user: savedUser.data } }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  private async executeAsyncSideEffects(user: User): Promise<void> {
    try {
      await Promise.allSettled([
        this.emailService.sendWelcomeEmail(user.email, user.firstName),
        this.auditLogger?.logUserCreation(user.id),
      ])
    } catch (error) {
      console.error('Side effect failed:', error) // Log but don't fail main flow
    }
  }
}
```

### Repository Pattern (Data Access Abstraction)
```typescript
// Domain Interface (Contract)
export interface UserRepository {
  findById(id: string): Promise<Result<User | null>>
  findByEmail(email: string): Promise<Result<User | null>>
  save(user: User): Promise<Result<User>>
  emailExists(email: string): Promise<Result<boolean>>
}

// Infrastructure Implementation
export class UserApiRepository implements UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async findById(id: string): Promise<Result<User | null>> {
    try {
      const response = await this.httpClient.get<UserApiData>(`/users/${id}`)
      
      if (!response.success) {
        return { success: false, error: new Error(response.error.message) }
      }

      const user = this.mapToDomain(response.data)
      return { success: true, data: user }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }

  private mapToDomain(apiData: UserApiData): User {
    return User.fromPersistence({
      id: apiData.id,
      email: apiData.email,
      firstName: apiData.first_name,
      lastName: apiData.last_name,
      isActive: apiData.is_active,
      roles: apiData.roles,
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at),
    })
  }
}
```

### Component Architecture (Smart vs Dumb)
```typescript
// Smart Component (Container) - Orchestrates Use Cases
export function UserManagementPage(): JSX.Element {
  const createUserUseCase = useCreateUserUseCase()
  const listUsersUseCase = useListUsersUseCase()
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const result = await listUsersUseCase.execute({
      pagination: { page: 1, pageSize: 20 }
    })
    
    if (result.success) {
      setUsers(result.data.users.data)
    } else {
      setError(result.error.message)
    }
    
    setLoading(false)
  }, [listUsersUseCase])

  const handleCreateUser = useCallback(async (userData: CreateUserInput) => {
    const result = await createUserUseCase.execute(userData)
    
    if (result.success) {
      toast.success('Benutzer erfolgreich erstellt')
      await loadUsers() // Refresh list
    } else {
      toast.error(result.error.message)
    }
  }, [createUserUseCase, loadUsers])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return (
    <PageContainer 
      title="Benutzerverwaltung" 
      subtitle="Verwalten Sie Benutzerkonten"
    >
      <SuspenseLoading loading={loading} error={error} retry={loadUsers}>
        <UserManagementView 
          users={users}
          onCreateUser={handleCreateUser}
          onRefresh={loadUsers}
        />
      </SuspenseLoading>
    </PageContainer>
  )
}

// Dumb Component (Presentational) - Pure UI
interface UserManagementViewProps {
  readonly users: User[]
  readonly onCreateUser: (data: CreateUserInput) => Promise<void>
  readonly onRefresh: () => Promise<void>
}

export function UserManagementView({ 
  users, 
  onCreateUser, 
  onRefresh 
}: UserManagementViewProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Benutzer ({users.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            Aktualisieren
          </Button>
          <CreateUserDialog onSubmit={onCreateUser} />
        </div>
      </div>
      
      <UserTable users={users} />
    </div>
  )
}
```

### Dependency Injection Setup
```typescript
// Central DI Container
export function DependencyProvider({ children, overrides }: DependencyProviderProps): JSX.Element {
  const dependencies = useMemo(() => {
    // 1. Create Infrastructure Services
    const httpClient = HttpClient.create({
      baseUrl: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
    })
    
    const storageService = StorageServiceFactory.createAppStorage()
    const passwordHasher = PasswordHasherFactory.createWebCrypto()
    const emailService = EmailServiceFactory.createMock()

    // 2. Create Repository Implementations
    const userRepository = new UserApiRepository(httpClient)
    const productRepository = new ProductApiRepository(httpClient)

    // 3. Create Use Cases with Injected Dependencies
    const createUserUseCase = new CreateUserUseCase(
      userRepository,
      passwordHasher,
      emailService
    )
    
    const getUserUseCase = new GetUserUseCase(userRepository)
    const listUsersUseCase = new ListUsersUseCase(userRepository)

    // 4. Return Dependency Graph
    const baseDependencies: Dependencies = {
      // Infrastructure
      httpClient,
      storageService,
      
      // Repositories
      userRepository,
      productRepository,
      
      // Use Cases
      createUserUseCase,
      getUserUseCase,
      listUsersUseCase,
    }

    return { ...baseDependencies, ...overrides }
  }, [overrides])

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  )
}

// Type-safe Hooks for Dependencies
export function useCreateUserUseCase(): CreateUserUseCase {
  return useDependencies().createUserUseCase
}

export function useUserRepository(): UserRepository {
  return useDependencies().userRepository
}
```

## Advanced Patterns

### Error Handling Strategy
```typescript
// Domain-specific Errors
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
  constructor(message: string, public readonly field: string) {
    super(message, 'VALIDATION_ERROR', { field })
  }
}

// Result Pattern for Explicit Error Handling
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Usage in Components
const result = await createUserUseCase.execute(formData)
if (result.success) {
  // Handle success
  navigate(`/users/${result.data.user.id}`)
} else {
  // Handle specific errors
  if (result.error instanceof ValidationError) {
    setFieldError(result.error.field, result.error.message)
  } else {
    setGeneralError(result.error.message)
  }
}
```

### Testing Strategy by Layer

#### Domain Layer Tests (Pure Business Logic)
```typescript
describe('User Entity', () => {
  describe('creation', () => {
    it('should create valid user', () => {
      const user = User.create({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe'
      })
      
      expect(user.fullName).toBe('John Doe')
      expect(user.isActive).toBe(true)
    })

    it('should enforce email validation', () => {
      expect(() => User.create({
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe'
      })).toThrow(ValidationError)
    })
  })

  describe('business rules', () => {
    it('should allow profile updates when active', () => {
      const user = User.create(validUserData)
      
      const updatedUser = user.updateProfile({
        firstName: 'Jane'
      })
      
      expect(updatedUser.firstName).toBe('Jane')
      expect(updatedUser.id).toBe(user.id) // Preserves identity
    })
  })
})

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let mockUserRepository: jest.Mocked<UserRepository>
  let mockPasswordHasher: jest.Mocked<PasswordHasher>
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    mockUserRepository = {
      emailExists: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    }
    
    mockPasswordHasher = {
      hash: jest.fn(),
      verify: jest.fn(),
    }
    
    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
    }

    useCase = new CreateUserUseCase(
      mockUserRepository,
      mockPasswordHasher,
      mockEmailService
    )
  })

  it('should create user when email is unique', async () => {
    // Arrange
    mockUserRepository.emailExists.mockResolvedValue({ success: true, data: false })
    mockUserRepository.save.mockResolvedValue({ 
      success: true, 
      data: expect.any(User) 
    })
    mockPasswordHasher.hash.mockResolvedValue('hashed-password')

    // Act
    const result = await useCase.execute({
      email: 'new@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    })

    // Assert
    expect(result.success).toBe(true)
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User))
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'new@example.com',
      'John'
    )
  })

  it('should reject duplicate email', async () => {
    mockUserRepository.emailExists.mockResolvedValue({ success: true, data: true })

    const result = await useCase.execute(validCreateUserInput)

    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(DomainError)
    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })
})
```

#### Integration Tests (Repository Layer)
```typescript
describe('UserApiRepository', () => {
  let repository: UserApiRepository
  let mockHttpClient: MockHttpClient

  beforeEach(() => {
    mockHttpClient = new MockHttpClient()
    repository = new UserApiRepository(mockHttpClient)
  })

  it('should map API response to domain entity', async () => {
    // Arrange
    const apiResponse = {
      id: '123',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    
    mockHttpClient.get.mockResolvedValue({
      success: true,
      data: apiResponse
    })

    // Act
    const result = await repository.findById('123')

    // Assert
    expect(result.success).toBe(true)
    expect(result.data).toBeInstanceOf(User)
    expect(result.data!.email).toBe('john@example.com')
    expect(result.data!.fullName).toBe('John Doe')
  })
})
```

#### Component Tests (UI Layer)
```typescript
describe('UserManagementPage', () => {
  const mockDependencies = createTestDependencies({
    listUsersUseCase: {
      execute: jest.fn().mockResolvedValue({
        success: true,
        data: { users: { data: [mockUser1, mockUser2] } }
      })
    }
  })

  it('should display user list on load', async () => {
    render(
      <DependencyProvider overrides={mockDependencies}>
        <UserManagementPage />
      </DependencyProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('should handle user creation', async () => {
    const user = userEvent.setup()
    
    render(
      <DependencyProvider overrides={mockDependencies}>
        <UserManagementPage />
      </DependencyProvider>
    )

    // Open create dialog
    await user.click(screen.getByRole('button', { name: /neuer benutzer/i }))
    
    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'new@example.com')
    await user.type(screen.getByLabelText(/vorname/i), 'New')
    await user.type(screen.getByLabelText(/nachname/i), 'User')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /erstellen/i }))

    expect(mockDependencies.createUserUseCase.execute).toHaveBeenCalledWith({
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      password: expect.any(String)
    })
  })
})
```

## Code Quality Guidelines

### TypeScript Configuration
- **Strict mode enabled**: No `any` types allowed
- **Null safety**: All nullable types explicitly handled
- **Readonly interfaces**: Immutability by default
- **Path aliases**: Clean import statements

### Performance Optimizations
```typescript
// Lazy loading with Suspense
const UserDetailPage = React.lazy(() => import('./UserDetailPage'))

// Memoization for expensive computations
const processedUsers = useMemo(() => {
  return users
    .filter(user => user.isActive)
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
}, [users])

// Callback memoization
const handleUserSelect = useCallback((userId: string) => {
  navigate(`/users/${userId}`)
}, [navigate])

// Component memoization
export const UserCard = React.memo(({ user }: { user: User }) => (
  <div className="border rounded p-4">
    <h3>{user.fullName}</h3>
    <p>{user.email}</p>
  </div>
))
```

## AI Collaboration Prompts

### Feature Development
```
Implement [FEATURE_NAME] following this Clean Architecture template:

1. **Domain Layer**: Create Entity with business rules and Use Case with application logic
2. **Infrastructure**: Implement Repository with API integration  
3. **Presentation**: Create Smart Component using Use Case and Dumb Components for UI
4. **Integration**: Add to Dependency Injection container
5. **Tests**: Unit tests for Domain, Integration tests for Infrastructure, Component tests for UI

Requirements: [DETAILED_REQUIREMENTS]
Acceptance Criteria: [ACCEPTANCE_CRITERIA]

Follow the established patterns and maintain strict layer separation.
```

### Debugging & Refactoring
```
Analyze and fix the issue in [COMPONENT/FILE]:

1. Check for Layer dependency violations (Domain → Infrastructure is forbidden)
2. Verify Result pattern usage for error handling
3. Ensure proper TypeScript typing (no `any`)
4. Validate SOLID principles compliance
5. Check for proper separation of Smart/Dumb components

Current Issue: [ISSUE_DESCRIPTION]
Expected Behavior: [EXPECTED_BEHAVIOR]

Provide solution maintaining Clean Architecture principles.
```

---

**Remember**: This architecture prioritizes **maintainability**, **testability**, and **business logic clarity** over quick solutions. Always follow the dependency rule and keep business logic in the Domain layer.
