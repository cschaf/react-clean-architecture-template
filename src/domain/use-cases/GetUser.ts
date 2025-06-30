/**
 * Get User Use Case - Domain Layer
 * Diese Klasse implementiert die Geschäftslogik für das Abrufen von Benutzern
 */

import { User } from '@/domain/entities/User'
import { UserRepository } from '@/domain/repositories/UserRepository'
import { Result, NotFoundError, DomainError } from '@/shared/types'

export interface GetUserInput {
  readonly id: string
}

export interface GetUserOutput {
  readonly user: User
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(input: GetUserInput): Promise<Result<GetUserOutput>> {
    try {
      // 1. Validiere Input
      if (!input.id || input.id.trim().length === 0) {
        return {
          success: false,
          error: new DomainError('Benutzer-ID ist erforderlich', 'INVALID_INPUT'),
        }
      }

      // 2. Suche User im Repository
      const userResult = await this.userRepository.findById(input.id)
      if (!userResult.success) {
        return { success: false, error: userResult.error }
      }

      // 3. Prüfe ob User existiert
      if (!userResult.data) {
        return {
          success: false,
          error: new NotFoundError('Benutzer', input.id),
        }
      }

      return {
        success: true,
        data: {
          user: userResult.data,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unbekannter Fehler beim Abrufen des Benutzers'),
      }
    }
  }
}
