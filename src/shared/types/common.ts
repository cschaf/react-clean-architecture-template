/**
 * Gemeinsame Typen für die gesamte Anwendung
 * Diese Datei definiert grundlegende Typen, die in mehreren Schichten verwendet werden
 */

// Base Entity Type
export interface BaseEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = unknown> {
  readonly data: T
  readonly success: boolean
  readonly message?: string
}

export interface ApiErrorResponse {
  readonly error: {
    readonly code: string
    readonly message: string
    readonly details?: Record<string, unknown>
  }
  readonly success: false
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number
    readonly pageSize: number
    readonly total: number
    readonly totalPages: number
    readonly hasNext: boolean
    readonly hasPrevious: boolean
  }
}

// Pagination Parameters
export interface PaginationParams {
  readonly page?: number
  readonly pageSize?: number
  readonly sortBy?: string
  readonly sortOrder?: 'asc' | 'desc'
}

// Filter Types
export interface FilterParams {
  readonly search?: string
  readonly status?: string
  readonly dateFrom?: Date
  readonly dateTo?: Date
}

// Result Types (für Use Cases)
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Event Types
export interface DomainEvent {
  readonly type: string
  readonly aggregateId: string
  readonly occurredAt: Date
  readonly data: Record<string, unknown>
}

// Error Types
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
  constructor(
    message: string,
    public readonly field: string,
    context?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', { field, ...context })
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} mit ID ${id} wurde nicht gefunden`, 'NOT_FOUND', { resource, id })
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Nicht autorisiert') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

// Component Props Types
export interface ComponentWithChildren {
  readonly children: React.ReactNode
}

export interface ComponentWithClassName {
  readonly className?: string
}

export interface LoadingState {
  readonly isLoading: boolean
  readonly error?: string | null
}

// Form Types
export interface FormField<T = string> {
  readonly value: T
  readonly error?: string
  readonly touched: boolean
}

export interface FormState<T extends Record<string, unknown>> {
  readonly fields: { [K in keyof T]: FormField<T[K]> }
  readonly isValid: boolean
  readonly isSubmitting: boolean
  readonly submitError?: string
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'
export type Language = 'de' | 'en'

// Navigation Types
export interface NavigationItem {
  readonly id: string
  readonly label: string
  readonly path: string
  readonly icon?: string
  readonly children?: NavigationItem[]
  readonly requiresAuth?: boolean
}

// Permission Types
export interface Permission {
  readonly resource: string
  readonly action: 'create' | 'read' | 'update' | 'delete'
}

export interface Role {
  readonly id: string
  readonly name: string
  readonly permissions: Permission[]
}
