# GitHub Copilot Integration Guide

## Projektkontext für Copilot

Dieses React-Projekt folgt **Clean Architecture** mit strikter Layer-Trennung und SOLID-Prinzipien. Verwende diese Kommentare in deinem Code, um Copilot bessere Vorschläge zu geben.

## Ordnerstruktur-Kommentare

```typescript
// Clean Architecture Layers:
// src/domain/           - Business Logic (Entities, Use Cases, Interfaces)
// src/infrastructure/   - External Concerns (API, Storage, Services)  
// src/presentation/     - UI Components and Pages
// src/app/             - Application Configuration (DI, Providers, Router)
// src/shared/          - Shared Utilities, Types, Constants

// Import Aliases:
// @/domain     - Business logic layer
// @/infrastructure - External services layer
// @/presentation - UI layer
// @/app        - Application layer
// @/shared     - Shared utilities
```

## Code-Templates für Copilot

### 1. Neue Domain Entity erstellen

```typescript
// Domain Entity: Immutable business object with validation and business rules
// Pattern: Constructor validation, factory methods, immutable updates
export class ProductEntity implements BaseEntity {
  private constructor(private readonly props: ProductProps) {
    // Business rule validation in constructor
    this.validateBusinessRules()
  }

  // Factory method for new instances
  public static create(props: CreateProductProps): ProductEntity {
    // Copilot: Generate ID, timestamps, and call constructor
  }

  // Factory method for existing data
  public static fromPersistence(props: ProductProps): ProductEntity {
    // Copilot: Restore from database/API data
  }

  // Immutable update method
  public updateDetails(updates: Partial<UpdateProductProps>): ProductEntity {
    // Copilot: Create new instance with merged props and updated timestamp
  }

  // Business logic methods
  public canBeOrdered(): boolean {
    // Copilot: Implement business rules for ordering
  }

  // Computed properties
  public get displayPrice(): string {
    // Copilot: Format price with currency
  }

  private validateBusinessRules(): void {
    // Copilot: Validate business constraints (price > 0, valid category, etc.)
  }
}
```

### 2. Use Case mit Dependency Injection

```typescript
// Use Case: Application business logic with injected dependencies
// Pattern: Constructor injection, Result pattern, async operations
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,    // Interface from domain
    private readonly inventoryService: InventoryService,      // Interface from domain
    private readonly auditLogger?: AuditLogger               // Optional dependency
  ) {}

  public async execute(input: CreateProductInput): Promise<Result<CreateProductOutput>> {
    try {
      // 1. Input validation with Zod schema
      // Copilot: Validate input against createProductSchema
      
      // 2. Business rule checks
      // Copilot: Check if product name exists, validate category, etc.
      
      // 3. Create domain entity
      // Copilot: Create ProductEntity with business logic
      
      // 4. Persist entity
      // Copilot: Save through repository interface
      
      // 5. Side effects (fire and forget)
      // Copilot: Log audit, send notifications, etc.
      
      return { success: true, data: { product } }
    } catch (error) {
      // Copilot: Return typed error result
    }
  }
}
```

### 3. Repository Implementation

```typescript
// Repository Implementation: Data access with domain mapping
// Pattern: Interface implementation, API mapping, error handling
export class ProductApiRepository implements ProductRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async findById(id: string): Promise<Result<ProductEntity | null>> {
    try {
      // Copilot: Make HTTP GET request to /products/{id}
      const response = await this.httpClient.get<ProductApiData>(`/products/${id}`)
      
      if (!response.success) {
        // Copilot: Handle API error response
      }

      // Copilot: Map API data to domain entity
      const product = this.mapToDomain(response.data)
      return { success: true, data: product }
    } catch (error) {
      // Copilot: Handle network/parsing errors
    }
  }

  private mapToDomain(apiData: ProductApiData): ProductEntity {
    // Copilot: Map snake_case API response to domain entity
    return ProductEntity.fromPersistence({
      id: apiData.id,
      name: apiData.product_name,
      price: apiData.price_cents / 100,
      category: apiData.category_slug,
      createdAt: new Date(apiData.created_at),
      // ... more mappings
    })
  }
}
```

### 4. React Smart Component

```typescript
// Smart Component: Container with use case orchestration
// Pattern: Custom hooks for dependencies, state management, error handling
export function ProductManagementPage(): JSX.Element {
  // Copilot: Get use cases from dependency injection
  const createProductUseCase = useCreateProductUseCase()
  const listProductsUseCase = useListProductsUseCase()
  
  // Copilot: State for products list, loading, errors
  const [products, setProducts] = useState<ProductEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Copilot: Load products on component mount
  const loadProducts = useCallback(async () => {
    // Implementation with use case execution and error handling
  }, [listProductsUseCase])

  // Copilot: Handle product creation with form validation
  const handleCreateProduct = useCallback(async (formData: CreateProductInput) => {
    // Implementation with use case execution and UI feedback
  }, [createProductUseCase])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <PageContainer title="Produktverwaltung">
      {/* Copilot: Render loading/error states and product list */}
    </PageContainer>
  )
}
```

### 5. Dumb Component

```typescript
// Dumb Component: Pure UI component with props interface
// Pattern: Readonly props, event callbacks, accessibility
interface ProductListProps {
  readonly products: ProductEntity[]
  readonly onProductSelect: (product: ProductEntity) => void
  readonly onCreateProduct: () => void
}

export function ProductList({ 
  products, 
  onProductSelect, 
  onCreateProduct 
}: ProductListProps): JSX.Element {
  return (
    <div className="space-y-4">
      {/* Copilot: Create responsive grid with product cards */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Produkte ({products.length})
        </h2>
        <Button onClick={onCreateProduct}>
          Neues Produkt
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onClick={() => onProductSelect(product)}
          />
        ))}
      </div>
    </div>
  )
}
```

## Copilot-Optimierte Kommentare

### Für Entity-Entwicklung
```typescript
// Business Entity: [EntityName] with immutable state and business rules
// Validation: [list validation rules]
// Business Methods: [list key business operations]
// Computed Properties: [list derived values]
```

### Für Use Case-Entwicklung  
```typescript
// Use Case: [ActionName] with dependencies: [list dependencies]
// Input: [describe input structure]
// Business Rules: [list business constraints to check]
// Side Effects: [list additional operations]
// Output: [describe success result]
```

### Für Repository-Entwicklung
```typescript
// Repository: [EntityName] data access via [API/Database]
// Mapping: [API format] -> Domain Entity
// Error Handling: [list error scenarios]
// Caching: [if applicable]
```

### Für Component-Entwicklung
```typescript
// Smart Component: [PageName] with use cases [list use cases]
// State: [list state variables]
// Effects: [list side effects and dependencies]
// Events: [list user interactions]

// Dumb Component: [ComponentName] UI-only component
// Props: [list required props]
// Styling: [styling approach - Tailwind classes]
// Accessibility: [ARIA labels, semantic HTML]
```

## Test-Templates für Copilot

### Domain Entity Tests
```typescript
describe('ProductEntity', () => {
  // Copilot: Test creation with valid data
  it('should create product with valid business data', () => {
    // Arrange: Valid product data
    // Act: ProductEntity.create()
    // Assert: Properties and computed values
  })

  // Copilot: Test business rule validation
  it('should enforce business rules on creation', () => {
    // Arrange: Invalid data (negative price, empty name)
    // Act: Expect creation to throw ValidationError
    // Assert: Specific error messages
  })

  // Copilot: Test immutable updates
  it('should create new instance on updates', () => {
    // Arrange: Original entity
    // Act: updateDetails()
    // Assert: New instance with updated data, original unchanged
  })
})
```

### Use Case Tests
```typescript
describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase
  let mockRepository: jest.Mocked<ProductRepository>

  beforeEach(() => {
    // Copilot: Setup mocked dependencies
    mockRepository = createMockProductRepository()
    useCase = new CreateProductUseCase(mockRepository)
  })

  // Copilot: Test successful creation flow
  it('should create product when business rules pass', async () => {
    // Arrange: Mock successful repository responses
    // Act: Execute use case with valid input
    // Assert: Success result, repository called, side effects triggered
  })

  // Copilot: Test business rule violations
  it('should reject duplicate product names', async () => {
    // Arrange: Mock repository to return existing product
    // Act: Execute use case with duplicate name
    // Assert: Failure result with specific error
  })
})
```

### Component Tests
```typescript
describe('ProductManagementPage', () => {
  const mockDependencies = createTestDependencies()

  // Copilot: Test component rendering with data
  it('should display products after loading', async () => {
    // Arrange: Mock use case with test data
    // Act: Render component with dependency provider
    // Assert: Products displayed, loading state handled
  })

  // Copilot: Test user interactions
  it('should handle product creation flow', async () => {
    const user = userEvent.setup()
    
    // Arrange: Render component
    // Act: Click create button, fill form, submit
    // Assert: Use case called with correct data
  })
})
```

## Copilot Code-Completion Hints

### Verwende diese Präfixe für bessere Vorschläge:

```typescript
// Entity creation:
const user = User.create({
  // Copilot wird Props vorschlagen
  
// Use case execution:  
const result = await createUserUseCase.execute({
  // Copilot wird Input-Type vorschlagen
  
// Repository method:
const user = await userRepository.findById(
  // Copilot wird ID-Parameter vorschlagen
  
// Component props:
<UserCard 
  user={user}
  onClick={
    // Copilot wird Event-Handler vorschlagen
    
// Test setup:
const mockRepository = {
  findById: jest.fn().mockResolvedValue({
    // Copilot wird Result-Type vorschlagen
```

## Error Handling Patterns

```typescript
// Result Pattern - Copilot erkennt dieses Muster:
const result = await someUseCase.execute(input)
if (result.success) {
  // Copilot: Handle success case
} else {
  // Copilot: Handle error case based on error type
}

// Domain Errors - Copilot erkennt Error-Hierarchie:
throw new ValidationError('Message', 'field')
throw new DomainError('Message', 'ERROR_CODE')

// Component Error Boundaries:
<ErrorBoundary fallback={<ErrorComponent />}>
  // Copilot: Komponenten die Fehler werfen können
</ErrorBoundary>
```

## Performance Patterns

```typescript
// Memoization - Copilot erkennt diese Optimierungen:
const ExpensiveComponent = React.memo(({ data }) => {
  // Copilot: Memoized component implementation
})

const memoizedValue = useMemo(() => {
  // Copilot: Expensive computation
}, [dependencies])

const memoizedCallback = useCallback((param) => {
  // Copilot: Event handler implementation  
}, [dependencies])

// Lazy loading:
const LazyPage = React.lazy(() => import('./SomePage'))
```

## Styling mit Tailwind

```typescript
// Copilot erkennt Tailwind-Patterns:
<div className="flex items-center justify-between p-4 bg-card rounded-lg border">
  // Copilot: Weitere Tailwind-Klassen basierend auf Design System
  
<Button 
  variant="outline" 
  size="sm" 
  className="hover:bg-accent"
>
  // Copilot: Button-Content
</Button>
```

---

**Tipp**: Verwende aussagekräftige Kommentare vor Code-Blöcken, damit Copilot den Kontext und die gewünschte Implementierung besser versteht. Je spezifischer deine Kommentare, desto bessere Vorschläge erhältst du.