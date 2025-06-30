/**
 * User Repository Interface - Domain Layer
 * Diese Datei definiert das Interface für die Benutzer-Datenpersistierung
 */

import { User } from '@/domain/entities/User'
import { Result, PaginatedResponse, PaginationParams, FilterParams } from '@/shared/types'

export interface UserRepository {
  /**
   * Findet einen Benutzer anhand der ID
   */
  findById(id: string): Promise<Result<User | null>>

  /**
   * Findet einen Benutzer anhand der E-Mail
   */
  findByEmail(email: string): Promise<Result<User | null>>

  /**
   * Findet alle Benutzer mit Paginierung und Filterung
   */
  findAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Promise<Result<PaginatedResponse<User>>>

  /**
   * Sucht Benutzer anhand verschiedener Kriterien
   */
  search(
    query: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<User>>>

  /**
   * Findet aktive Benutzer
   */
  findActive(pagination: PaginationParams): Promise<Result<PaginatedResponse<User>>>

  /**
   * Findet Benutzer anhand der Rolle
   */
  findByRole(
    role: string,
    pagination: PaginationParams
  ): Promise<Result<PaginatedResponse<User>>>

  /**
   * Speichert einen neuen Benutzer
   */
  save(user: User): Promise<Result<User>>

  /**
   * Aktualisiert einen existierenden Benutzer
   */
  update(user: User): Promise<Result<User>>

  /**
   * Löscht einen Benutzer anhand der ID
   */
  delete(id: string): Promise<Result<void>>

  /**
   * Prüft ob eine E-Mail bereits existiert
   */
  emailExists(email: string): Promise<Result<boolean>>

  /**
   * Zählt alle Benutzer
   */
  count(): Promise<Result<number>>

  /**
   * Zählt aktive Benutzer
   */
  countActive(): Promise<Result<number>>

  /**
   * Findet Benutzer, die in den letzten N Tagen erstellt wurden
   */
  findRecentUsers(days: number): Promise<Result<User[]>>

  /**
   * Findet Benutzer, die sich zuletzt an einem bestimmten Datum angemeldet haben
   */
  findByLastLoginDate(date: Date): Promise<Result<User[]>>

  /**
   * Bulk-Update für mehrere Benutzer
   */
  updateMany(users: User[]): Promise<Result<User[]>>

  /**
   * Soft-Delete für einen Benutzer (deaktivieren statt löschen)
   */
  softDelete(id: string): Promise<Result<void>>

  /**
   * Reaktiviert einen deaktivierten Benutzer
   */
  reactivate(id: string): Promise<Result<User>>
}
