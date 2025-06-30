/**
 * User API Repository - Infrastructure Layer
 * Diese Klasse implementiert das UserRepository Interface mit HTTP-API-Aufrufen
 */

import { UserRepository } from '@/domain/repositories/UserRepository'
import { User } from '@/domain/entities/User'
import { Result, PaginatedResponse, PaginationParams, FilterParams, ApiErrorResponse } from '@/shared/types'
import { HttpClient } from './HttpClient'

interface UserApiData {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly avatar?: string
  readonly isActive: boolean
  readonly roles: string[]
  readonly lastLoginAt?: string
  readonly createdAt: string
  readonly updatedAt: string
}

export class UserApiRepository implements UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async findById(id: string): Promise<Result<User | null>> {
    try {
      const response = await this.httpClient.get<UserApiData>(`/users/${id}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        if (errorResponse.error.code === 'NOT_FOUND') {
          return { success: true, data: null }
        }
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const user = this.mapApiDataToUser(response.data)
      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Abrufen des Benutzers'),
      }
    }
  }

  public async findByEmail(email: string): Promise<Result<User | null>> {
    try {
      const response = await this.httpClient.get<UserApiData[]>(`/users/search?email=${encodeURIComponent(email)}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const users = response.data
      if (users.length === 0) {
        return { success: true, data: null }
      }

      const user = this.mapApiDataToUser(users[0]!)
      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Suchen des Benutzers'),
      }
    }
  }

  public async findAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Promise<Result<PaginatedResponse<User>>> {
    try {
      const queryParams = this.buildQueryParams(pagination, filters)
      const response = await this.httpClient.get<PaginatedResponse<UserApiData>>(`/users?${queryParams}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const paginatedUsers: PaginatedResponse<User> = {
        ...response.data,
        data: response.data.data.map(userData => this.mapApiDataToUser(userData)),
      }

      return { success: true, data: paginatedUsers }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Abrufen der Benutzer'),
      }
    }
  }

  public async search(
    query: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<User>>> {
    try {
      const queryParams = this.buildQueryParams(pagination, { search: query })
      const response = await this.httpClient.get<PaginatedResponse<UserApiData>>(`/users/search?${queryParams}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const paginatedUsers: PaginatedResponse<User> = {
        ...response.data,
        data: response.data.data.map(userData => this.mapApiDataToUser(userData)),
      }

      return { success: true, data: paginatedUsers }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Suchen der Benutzer'),
      }
    }
  }

  public async findActive(pagination: PaginationParams): Promise<Result<PaginatedResponse<User>>> {
    return this.findAll(pagination, { status: 'active' })
  }

  public async findByRole(
    role: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<User>>> {
    try {
      const queryParams = this.buildQueryParams(pagination, { role })
      const response = await this.httpClient.get<PaginatedResponse<UserApiData>>(`/users?${queryParams}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const paginatedUsers: PaginatedResponse<User> = {
        ...response.data,
        data: response.data.data.map(userData => this.mapApiDataToUser(userData)),
      }

      return { success: true, data: paginatedUsers }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Abrufen der Benutzer nach Rolle'),
      }
    }
  }

  public async save(user: User): Promise<Result<User>> {
    try {
      const userData = this.mapUserToApiData(user)
      const response = await this.httpClient.post<UserApiData>('/users', userData)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const createdUser = this.mapApiDataToUser(response.data)
      return { success: true, data: createdUser }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Speichern des Benutzers'),
      }
    }
  }

  public async update(user: User): Promise<Result<User>> {
    try {
      const userData = this.mapUserToApiData(user)
      const response = await this.httpClient.put<UserApiData>(`/users/${user.id}`, userData)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const updatedUser = this.mapApiDataToUser(response.data)
      return { success: true, data: updatedUser }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Aktualisieren des Benutzers'),
      }
    }
  }

  public async delete(id: string): Promise<Result<void>> {
    try {
      const response = await this.httpClient.delete(`/users/${id}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Löschen des Benutzers'),
      }
    }
  }

  public async emailExists(email: string): Promise<Result<boolean>> {
    try {
      const response = await this.httpClient.get<{ exists: boolean }>(`/users/email-exists?email=${encodeURIComponent(email)}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      return { success: true, data: response.data.exists }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Prüfen der E-Mail'),
      }
    }
  }

  public async count(): Promise<Result<number>> {
    try {
      const response = await this.httpClient.get<{ count: number }>('/users/count')
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      return { success: true, data: response.data.count }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Zählen der Benutzer'),
      }
    }
  }

  public async countActive(): Promise<Result<number>> {
    try {
      const response = await this.httpClient.get<{ count: number }>('/users/count?status=active')
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      return { success: true, data: response.data.count }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Zählen der aktiven Benutzer'),
      }
    }
  }

  public async findRecentUsers(days: number): Promise<Result<User[]>> {
    try {
      const response = await this.httpClient.get<UserApiData[]>(`/users/recent?days=${days}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const users = response.data.map(userData => this.mapApiDataToUser(userData))
      return { success: true, data: users }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Abrufen der neuen Benutzer'),
      }
    }
  }

  public async findByLastLoginDate(date: Date): Promise<Result<User[]>> {
    try {
      const dateStr = date.toISOString().split('T')[0]
      const response = await this.httpClient.get<UserApiData[]>(`/users/last-login?date=${dateStr}`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const users = response.data.map(userData => this.mapApiDataToUser(userData))
      return { success: true, data: users }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Abrufen der Benutzer nach letztem Login'),
      }
    }
  }

  public async updateMany(users: User[]): Promise<Result<User[]>> {
    try {
      const usersData = users.map(user => this.mapUserToApiData(user))
      const response = await this.httpClient.put<UserApiData[]>('/users/bulk', usersData)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const updatedUsers = response.data.map(userData => this.mapApiDataToUser(userData))
      return { success: true, data: updatedUsers }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Bulk-Update der Benutzer'),
      }
    }
  }

  public async softDelete(id: string): Promise<Result<void>> {
    try {
      const response = await this.httpClient.patch(`/users/${id}/deactivate`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      return { success: true, data: undefined }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Deaktivieren des Benutzers'),
      }
    }
  }

  public async reactivate(id: string): Promise<Result<User>> {
    try {
      const response = await this.httpClient.patch<UserApiData>(`/users/${id}/activate`)
      
      if (!response.success) {
        const errorResponse = response as unknown as ApiErrorResponse
        return { success: false, error: new Error(errorResponse.error.message) }
      }

      const user = this.mapApiDataToUser(response.data)
      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Fehler beim Reaktivieren des Benutzers'),
      }
    }
  }

  // Private Helper Methods
  private mapApiDataToUser(data: UserApiData): User {
    return User.fromPersistence({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      isActive: data.isActive,
      roles: data.roles,
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })
  }

  private mapUserToApiData(user: User): Omit<UserApiData, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive,
      roles: [...user.roles],
      lastLoginAt: user.lastLoginAt?.toISOString(),
    }
  }

  private buildQueryParams(pagination: PaginationParams, filters?: FilterParams & { role?: string }): string {
    const params = new URLSearchParams()

    // Pagination
    if (pagination.page) params.append('page', pagination.page.toString())
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize.toString())
    if (pagination.sortBy) params.append('sortBy', pagination.sortBy)
    if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder)

    // Filters
    if (filters) {
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.role) params.append('role', filters.role)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString())
    }

    return params.toString()
  }
}
