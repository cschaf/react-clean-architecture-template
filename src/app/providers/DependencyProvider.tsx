/**
 * Dependency Injection Provider - Application Layer
 * Diese Komponente stellt alle Dependencies für die Anwendung bereit
 */

import React, { createContext, useContext, useMemo } from 'react'
import { UserRepository } from '@/domain/repositories'
import { CreateUserUseCase, GetUserUseCase, ListUsersUseCase, UpdateUserUseCase } from '@/domain/use-cases'
import { 
  HttpClient, 
  UserApiRepository,
  PasswordHasherFactory,
  EmailServiceFactory,
  StorageServiceFactory,
  AppStorageService
} from '@/infrastructure'

// Typen für Dependencies
export interface Dependencies {
  // Repositories
  readonly userRepository: UserRepository

  // Use Cases
  readonly createUserUseCase: CreateUserUseCase
  readonly getUserUseCase: GetUserUseCase
  readonly listUsersUseCase: ListUsersUseCase
  readonly updateUserUseCase: UpdateUserUseCase

  // Services
  readonly httpClient: HttpClient
  readonly storageService: AppStorageService
}

// Context für Dependencies
const DependencyContext = createContext<Dependencies | null>(null)

// Hook für den Zugriff auf Dependencies
export function useDependencies(): Dependencies {
  const dependencies = useContext(DependencyContext)
  if (!dependencies) {
    throw new Error('useDependencies muss innerhalb von DependencyProvider verwendet werden')
  }
  return dependencies
}

// Provider-Komponente
interface DependencyProviderProps {
  readonly children: React.ReactNode
  readonly overrides?: Partial<Dependencies> | undefined
}

export function DependencyProvider({ children, overrides }: DependencyProviderProps): JSX.Element {
  const dependencies = useMemo(() => {
    // 1. Erstelle grundlegende Services
    const storageService = StorageServiceFactory.createAppStorage()
    const httpClient = HttpClient.create()
    const passwordHasher = PasswordHasherFactory.createDefault()
    const emailService = EmailServiceFactory.createDefault()

    // 2. Erstelle Repositories
    const userRepository = new UserApiRepository(httpClient)

    // 3. Erstelle Use Cases mit Dependency Injection
    const createUserUseCase = new CreateUserUseCase(
      userRepository,
      passwordHasher,
      emailService
    )

    const getUserUseCase = new GetUserUseCase(userRepository)
    const listUsersUseCase = new ListUsersUseCase(userRepository)
    const updateUserUseCase = new UpdateUserUseCase(userRepository)

    // 4. Erstelle Dependencies-Objekt
    const baseDependencies: Dependencies = {
      // Repositories
      userRepository,

      // Use Cases
      createUserUseCase,
      getUserUseCase,
      listUsersUseCase,
      updateUserUseCase,

      // Services
      httpClient,
      storageService,
    }

    // 5. Anwende Overrides für Tests oder spezielle Konfigurationen
    return { ...baseDependencies, ...overrides }
  }, [overrides])

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  )
}

// Spezifische Hooks für einzelne Dependencies
export function useUserRepository(): UserRepository {
  return useDependencies().userRepository
}

export function useCreateUserUseCase(): CreateUserUseCase {
  return useDependencies().createUserUseCase
}

export function useGetUserUseCase(): GetUserUseCase {
  return useDependencies().getUserUseCase
}

export function useListUsersUseCase(): ListUsersUseCase {
  return useDependencies().listUsersUseCase
}

export function useUpdateUserUseCase(): UpdateUserUseCase {
  return useDependencies().updateUserUseCase
}

export function useHttpClient(): HttpClient {
  return useDependencies().httpClient
}

export function useStorageService(): AppStorageService {
  return useDependencies().storageService
}

// Factory für Test-Dependencies
export function createTestDependencies(overrides?: Partial<Dependencies>): Dependencies {
  // Mock-Services für Tests
  const mockHttpClient = HttpClient.create({ baseUrl: 'http://mock-api.test' })
  const mockStorageService = StorageServiceFactory.createAppStorage(
    StorageServiceFactory.createInMemoryStorage()
  )
  const mockUserRepository = new UserApiRepository(mockHttpClient)

  const mockPasswordHasher = PasswordHasherFactory.createDefault()
  const mockEmailService = EmailServiceFactory.createDefault()

  const mockCreateUserUseCase = new CreateUserUseCase(
    mockUserRepository,
    mockPasswordHasher,
    mockEmailService
  )

  const baseDependencies: Dependencies = {
    userRepository: mockUserRepository,
    createUserUseCase: mockCreateUserUseCase,
    getUserUseCase: new GetUserUseCase(mockUserRepository),
    listUsersUseCase: new ListUsersUseCase(mockUserRepository),
    updateUserUseCase: new UpdateUserUseCase(mockUserRepository),
    httpClient: mockHttpClient,
    storageService: mockStorageService,
  }

  return { ...baseDependencies, ...overrides }
}
