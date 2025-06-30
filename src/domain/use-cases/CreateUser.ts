/**
 * Create User Use Case - Domain Layer
 * Diese Klasse implementiert die Geschäftslogik für das Erstellen von Benutzern
 */

import { User } from '@/domain/entities/User'
import { UserRepository } from '@/domain/repositories/UserRepository'
import { Result, DomainError, ValidationError } from '@/shared/types'

export interface CreateUserInput {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly password: string
}

export interface CreateUserOutput {
  readonly user: User
}

export interface PasswordHasher {
  hash(password: string): Promise<string>
}

export interface EmailService {
  sendWelcomeEmail(email: string, firstName: string): Promise<void>
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService
  ) {}

  public async execute(input: CreateUserInput): Promise<Result<CreateUserOutput>> {
    try {
      // 1. Validiere Input
      const validationResult = this.validateInput(input)
      if (!validationResult.success) {
        return validationResult
      }

      // 2. Prüfe ob E-Mail bereits existiert
      const emailExistsResult = await this.userRepository.emailExists(input.email)
      if (!emailExistsResult.success) {
        return { success: false, error: emailExistsResult.error }
      }

      if (emailExistsResult.data) {
        return {
          success: false,
          error: new DomainError('E-Mail-Adresse ist bereits registriert', 'EMAIL_ALREADY_EXISTS', {
            email: input.email,
          }),
        }
      }

      // 3. Hash das Passwort
      const hashedPassword = await this.passwordHasher.hash(input.password)

      // 4. Erstelle User Entity
      const user = User.create({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        isActive: true,
        roles: ['user'], // Standard-Rolle
      })

      // 5. Speichere User in Repository
      const saveResult = await this.userRepository.save(user)
      if (!saveResult.success) {
        return { success: false, error: saveResult.error }
      }

      // 6. Sende Willkommens-E-Mail (async, Fehler werden geloggt aber nicht geworfen)
      this.sendWelcomeEmailAsync(input.email, input.firstName)

      return {
        success: true,
        data: {
          user: saveResult.data,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unbekannter Fehler beim Erstellen des Benutzers'),
      }
    }
  }

  private validateInput(input: CreateUserInput): Result<void> {
    if (!input.email || input.email.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('E-Mail ist erforderlich', 'email'),
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) {
      return {
        success: false,
        error: new ValidationError('Ungültige E-Mail-Adresse', 'email'),
      }
    }

    if (!input.firstName || input.firstName.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('Vorname ist erforderlich', 'firstName'),
      }
    }

    if (!input.lastName || input.lastName.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('Nachname ist erforderlich', 'lastName'),
      }
    }

    if (!input.password || input.password.length === 0) {
      return {
        success: false,
        error: new ValidationError('Passwort ist erforderlich', 'password'),
      }
    }

    if (input.password && input.password.length < 8) {
      return {
        success: false,
        error: new ValidationError('Passwort muss mindestens 8 Zeichen haben', 'password'),
      }
    }

    return { success: true, data: undefined }
  }

  private async sendWelcomeEmailAsync(email: string, firstName: string): Promise<void> {
    try {
      await this.emailService.sendWelcomeEmail(email, firstName)
    } catch (error) {
      // Log den Fehler, aber lass den Use Case nicht fehlschlagen
      console.error('Fehler beim Senden der Willkommens-E-Mail:', error)
    }
  }
}
