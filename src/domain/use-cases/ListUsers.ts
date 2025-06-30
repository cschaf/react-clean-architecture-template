/**
 * List Users Use Case - Domain Layer
 * Diese Klasse implementiert die Geschäftslogik für das Auflisten von Benutzern
 */

import { User } from '@/domain/entities/User'
import { UserRepository } from '@/domain/repositories/UserRepository'
import { Result, PaginatedResponse, PaginationParams, FilterParams, DomainError } from '@/shared/types'

export interface ListUsersInput {
  readonly pagination: PaginationParams
  readonly filters?: FilterParams
  readonly includeInactive?: boolean
}

export interface ListUsersOutput {
  readonly users: PaginatedResponse<User>
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(input: ListUsersInput): Promise<Result<ListUsersOutput>> {
    try {
      // 1. Validiere und normalisiere Pagination-Parameter
      const normalizedPagination = this.normalizePagination(input.pagination)

      // 2. Validiere Filter
      const validationResult = this.validateFilters(input.filters)
      if (!validationResult.success) {
        return validationResult
      }

      // 3. Erweitere Filter um Aktivitätsstatus falls erforderlich
      const filters = this.buildFilters(input.filters, input.includeInactive)

      // 4. Hole Benutzer vom Repository
      const usersResult = await this.userRepository.findAll(normalizedPagination, filters)
      if (!usersResult.success) {
        return { success: false, error: usersResult.error }
      }

      return {
        success: true,
        data: {
          users: usersResult.data,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unbekannter Fehler beim Auflisten der Benutzer'),
      }
    }
  }

  private normalizePagination(pagination: PaginationParams): PaginationParams {
    return {
      page: Math.max(1, pagination.page || 1),
      pageSize: Math.min(100, Math.max(5, pagination.pageSize || 10)),
      sortBy: pagination.sortBy || 'createdAt',
      sortOrder: pagination.sortOrder || 'desc',
    }
  }

  private validateFilters(filters?: FilterParams): Result<void> {
    if (!filters) {
      return { success: true, data: undefined }
    }

    const errors: string[] = []

    // Validiere Suchbegriff
    if (filters.search && filters.search.length > 100) {
      errors.push('Suchbegriff darf maximal 100 Zeichen haben')
    }

    // Validiere Datumsbereich
    if (filters.dateFrom && filters.dateTo) {
      if (filters.dateFrom > filters.dateTo) {
        errors.push('Startdatum muss vor dem Enddatum liegen')
      }
    }

    // Validiere Status
    if (filters.status && !['active', 'inactive', 'all'].includes(filters.status)) {
      errors.push('Ungültiger Status-Filter')
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: new DomainError(errors.join(', '), 'VALIDATION_ERROR', { errors }),
      }
    }

    return { success: true, data: undefined }
  }

  private buildFilters(inputFilters?: FilterParams, includeInactive?: boolean): FilterParams {
    const filters: FilterParams = { ...inputFilters }

    // Wenn includeInactive false ist, filtere nur aktive Benutzer
    if (!includeInactive && !filters.status) {
      return { ...filters, status: 'active' }
    }

    return filters
  }
}
