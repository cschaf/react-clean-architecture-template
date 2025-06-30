import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { DependencyProvider } from '@/app/providers/DependencyProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { User } from '@/domain/entities'
import type { Dependencies } from '@/app/providers/DependencyProvider'
import type { UserRepository } from '@/domain/repositories'
import type { 
  CreateUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase
} from '@/domain/use-cases'

// Mock Implementations for Testing
export function createMockUserRepository(): jest.Mocked<UserRepository> {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
    emailExists: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

export function createMockCreateUserUseCase(): jest.Mocked<CreateUserUseCase> {
  return {
    execute: vi.fn(),
  } as any
}

export function createMockGetUserUseCase(): jest.Mocked<GetUserUseCase> {
  return {
    execute: vi.fn(),
  } as any
}

export function createMockListUsersUseCase(): jest.Mocked<ListUsersUseCase> {
  return {
    execute: vi.fn(),
  } as any
}

export function createMockUpdateUserUseCase(): jest.Mocked<UpdateUserUseCase> {
  return {
    execute: vi.fn(),
  } as any
}

// Test Data Factories
export function createMockUser(overrides: Partial<any> = {}): User {
  const defaultProps = {
    id: `user-${Date.now()}-${Math.random()}`,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    roles: ['user'],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
    ...overrides,
  }
  
  return User.fromPersistence(defaultProps)
}

export function createMockUserList(count: number = 3): User[] {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
      firstName: `User${index + 1}`,
      lastName: `Test${index + 1}`,
    })
  )
}

// Test Dependencies Factory
export function createTestDependencies(overrides: Partial<Dependencies> = {}): Dependencies {
  const defaultDependencies: Dependencies = {
    // Infrastructure
    httpClient: {} as any,
    storageService: {} as any,
    
    // Repositories
    userRepository: createMockUserRepository(),
    
    // Use Cases
    createUserUseCase: createMockCreateUserUseCase(),
    getUserUseCase: createMockGetUserUseCase(),
    listUsersUseCase: createMockListUsersUseCase(),
    updateUserUseCase: createMockUpdateUserUseCase(),
  }

  return { ...defaultDependencies, ...overrides }
}

// Test Provider Component
interface TestProvidersProps {
  children: React.ReactNode
  dependencies?: Partial<Dependencies>
  initialRoute?: string
}

export function TestProviders({ 
  children, 
  dependencies = {},
  initialRoute = '/'
}: TestProvidersProps) {
  // Set initial route if specified
  if (initialRoute !== '/') {
    window.history.pushState({}, '', initialRoute)
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <DependencyProvider overrides={dependencies}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </DependencyProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

// Custom Render Function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  dependencies?: Partial<Dependencies>
  initialRoute?: string
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { dependencies, initialRoute, ...renderOptions } = options

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TestProviders dependencies={dependencies} initialRoute={initialRoute}>
        {children}
      </TestProviders>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Async Utilities
export function waitForAsyncOperations() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export async function waitForUseEffects() {
  await waitForAsyncOperations()
  await waitForAsyncOperations()
}

// Mock Browser APIs
export function mockLocalStorage() {
  const store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    key: vi.fn((index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    }),
    get length() {
      return Object.keys(store).length
    },
  }
}

export function mockSessionStorage() {
  return mockLocalStorage() // Same implementation for testing
}

export function mockMatchMedia() {
  return vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

export function mockResizeObserver() {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

export function mockIntersectionObserver() {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: vi.fn(),
  }))
}

// Setup global mocks
export function setupTestEnvironment() {
  // Mock browser APIs
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage(),
  })

  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage(),
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia(),
  })

  global.ResizeObserver = mockResizeObserver()
  global.IntersectionObserver = mockIntersectionObserver()

  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  return {
    cleanup: () => {
      vi.restoreAllMocks()
    },
  }
}

// Assert Utilities
export function expectElementToBeAccessible(element: HTMLElement) {
  // Check for proper ARIA attributes
  if (element.tagName === 'BUTTON') {
    expect(element).toHaveAttribute('type')
  }

  if (element.tagName === 'INPUT') {
    expect(element).toHaveAttribute('type')
    
    // Input should have associated label
    const id = element.getAttribute('id')
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      expect(label).toBeInTheDocument()
    }
  }

  if (element.tagName === 'IMG') {
    expect(element).toHaveAttribute('alt')
    const alt = element.getAttribute('alt')
    expect(alt).not.toBe('')
  }
}

export function expectProperSemanticStructure(container: HTMLElement) {
  // Check for semantic landmarks
  const main = container.querySelector('main')
  if (main) {
    expect(main).toBeInTheDocument()
  }

  // Check heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headings.length > 1) {
    const levels = Array.from(headings).map(h => parseInt(h.tagName.slice(1)))
    
    // First heading should be h1 or h2
    expect(levels[0]).toBeLessThanOrEqual(2)
    
    // No heading should skip more than one level
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1]
      expect(diff).toBeLessThanOrEqual(1)
    }
  }
}

// Performance Testing
export function measureRenderTime(renderFn: () => void) {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  return end - start
}

export function expectFastRender(renderFn: () => void, maxTime: number = 100) {
  const renderTime = measureRenderTime(renderFn)
  expect(renderTime).toBeLessThan(maxTime)
}

// Error Testing
export function expectToThrowDomainError(fn: () => void, errorCode?: string) {
  expect(fn).toThrow()
  
  try {
    fn()
  } catch (error) {
    expect(error).toHaveProperty('code')
    if (errorCode) {
      expect((error as any).code).toBe(errorCode)
    }
  }
}

// Form Testing Utilities
export async function fillForm(
  fields: Record<string, string>,
  user: any // userEvent instance
) {
  for (const [fieldName, value] of Object.entries(fields)) {
    const field = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement
    if (!field) {
      throw new Error(`Field with name "${fieldName}" not found`)
    }
    
    await user.clear(field)
    await user.type(field, value)
  }
}

export async function submitForm(user: any, submitButtonText: string = 'submit') {
  const submitButton = document.querySelector(
    `button[type="submit"], input[type="submit"], button:contains("${submitButtonText}")`
  )
  
  if (!submitButton) {
    throw new Error(`Submit button not found`)
  }
  
  await user.click(submitButton)
}

// Export everything for easy access
export * from '@testing-library/react'
export * from '@testing-library/user-event'
export { vi } from 'vitest'

// Re-export render as custom render by default
export { renderWithProviders as render }
