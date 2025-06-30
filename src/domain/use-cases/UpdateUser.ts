/**
 * Update User Use Case - Domain Layer
 * Diese Klasse implementiert die Geschäftslogik für das Aktualisieren von Benutzern
 */

import { User } from '@/domain/entities/User'
import { UserRepository } from '@/domain/repositories/UserRepository'
import { Result, NotFoundError, DomainError } from '@/shared/types'

export interface UpdateUserInput {
  readonly id: string
  readonly updates: {
    readonly firstName?: string
    readonly lastName?: string
    readonly avatar?: string
  }
}

export interface UpdateUserOutput {
  readonly user: User
}

export interface AuditLogger {
  logUserUpdate(userId: string, changes: Record<string, unknown>): Promise<void>
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLogger?: AuditLogger
  ) {}

  public async execute(input: UpdateUserInput): Promise<Result<UpdateUserOutput>> {
    try {
      // 1. Validiere Input
      const validationResult = this.validateInput(input)
      if (!validationResult.success) {
        return validationResult
      }

      // 2. Hole aktuellen User
      const currentUserResult = await this.userRepository.findById(input.id)
      if (!currentUserResult.success) {
        return { success: false, error: currentUserResult.error }
      }

      if (!currentUserResult.data) {
        return {
          success: false,
          error: new NotFoundError('Benutzer', input.id),
        }
      }

      const currentUser = currentUserResult.data

      // 3. Prüfe ob Änderungen vorhanden sind
      if (!this.hasChanges(currentUser, input.updates)) {
        return {
          success: true,
          data: { user: currentUser },
        }
      }

      // 4. Aktualisiere User Entity
      const updatedUser = currentUser.updateProfile(input.updates)

      // 5. Speichere aktualisierte User
      const saveResult = await this.userRepository.update(updatedUser)
      if (!saveResult.success) {
        return { success: false, error: saveResult.error }
      }

      // 6. Logge Änderungen für Audit-Trail
      if (this.auditLogger) {
        await this.logChanges(currentUser, updatedUser)
      }

      return {
        success: true,
        data: {
          user: saveResult.data,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unbekannter Fehler beim Aktualisieren des Benutzers'),
      }
    }
  }

  private validateInput(input: UpdateUserInput): Result<void> {
    const errors: string[] = []

    if (!input.id || input.id.trim().length === 0) {
      errors.push('Benutzer-ID ist erforderlich')
    }

    if (!input.updates || Object.keys(input.updates).length === 0) {
      errors.push('Mindestens eine Änderung ist erforderlich')
    }

    // Validiere spezifische Felder
    if (input.updates.firstName !== undefined) {
      if (input.updates.firstName.trim().length === 0) {
        errors.push('Vorname darf nicht leer sein')
      }
      if (input.updates.firstName.length > 50) {
        errors.push('Vorname darf maximal 50 Zeichen haben')
      }
    }

    if (input.updates.lastName !== undefined) {
      if (input.updates.lastName.trim().length === 0) {
        errors.push('Nachname darf nicht leer sein')
      }
      if (input.updates.lastName.length > 50) {
        errors.push('Nachname darf maximal 50 Zeichen haben')
      }
    }

    if (input.updates.avatar !== undefined && input.updates.avatar.length > 0) {
      try {
        new URL(input.updates.avatar)
      } catch {
        errors.push('Avatar-URL ist ungültig')
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: new DomainError(errors.join(', '), 'VALIDATION_ERROR', { errors }),
      }
    }

    return { success: true, data: undefined }
  }

  private hasChanges(currentUser: User, updates: UpdateUserInput['updates']): boolean {
    if (updates.firstName !== undefined && updates.firstName !== currentUser.firstName) {
      return true
    }
    if (updates.lastName !== undefined && updates.lastName !== currentUser.lastName) {
      return true
    }
    if (updates.avatar !== undefined && updates.avatar !== currentUser.avatar) {
      return true
    }
    return false
  }

  private async logChanges(oldUser: User, newUser: User): Promise<void> {
    if (!this.auditLogger) return

    const changes: Record<string, unknown> = {}

    if (oldUser.firstName !== newUser.firstName) {
      changes.firstName = { old: oldUser.firstName, new: newUser.firstName }
    }
    if (oldUser.lastName !== newUser.lastName) {
      changes.lastName = { old: oldUser.lastName, new: newUser.lastName }
    }
    if (oldUser.avatar !== newUser.avatar) {
      changes.avatar = { old: oldUser.avatar, new: newUser.avatar }
    }

    if (Object.keys(changes).length > 0) {
      try {
        await this.auditLogger.logUserUpdate(newUser.id, changes)
      } catch (error) {
        // Log den Fehler, aber lass den Use Case nicht fehlschlagen
        console.error('Fehler beim Loggen der Benutzer-Änderungen:', error)
      }
    }
  }
}
