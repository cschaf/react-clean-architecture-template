import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateUserUseCase } from '@/domain/use-cases'
import { User } from '@/domain/entities'
import type { UserRepository } from '@/domain/repositories'
import { ValidationError, DomainError } from '@/shared/types'

// Mock interfaces
interface MockPasswordHasher {
  hash: ReturnType<typeof vi.fn>
}

interface MockEmailService {
  sendWelcomeEmail: ReturnType<typeof vi.fn>
}

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let mockUserRepository: jest.Mocked<UserRepository>
  let mockPasswordHasher: MockPasswordHasher
  let mockEmailService: MockEmailService

  const validInput = {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'securePassword123',
  }

  beforeEach(() => {
    // Create mocked dependencies
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
      emailExists: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }

    mockPasswordHasher = {
      hash: vi.fn(),
    }

    mockEmailService = {
      sendWelcomeEmail: vi.fn(),
    }

    // Create use case with mocked dependencies
    useCase = new CreateUserUseCase(
      mockUserRepository,
      mockPasswordHasher as any,
      mockEmailService as any
    )
  })

  describe('successful user creation', () => {
    it('should create user with valid input', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123'
      const createdUser = User.create({
        email: validInput.email,
        firstName: validInput.firstName,
        lastName: validInput.lastName,
      })

      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.save.mockResolvedValue({
        success: true,
        data: createdUser,
      })
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined)

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.user).toBeInstanceOf(User)
        expect(result.data.user.email).toBe(validInput.email)
        expect(result.data.user.firstName).toBe(validInput.firstName)
        expect(result.data.user.lastName).toBe(validInput.lastName)
      }

      // Verify dependencies were called correctly
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(validInput.email)
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validInput.password)
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User))
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        validInput.email,
        validInput.firstName
      )
    })

    it('should create user even if email sending fails', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123'
      const createdUser = User.create({
        email: validInput.email,
        firstName: validInput.firstName,
        lastName: validInput.lastName,
      })

      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword)
      mockUserRepository.save.mockResolvedValue({
        success: true,
        data: createdUser,
      })
      mockEmailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service unavailable')
      )

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(true)
      expect(mockUserRepository.save).toHaveBeenCalled()
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalled()
    })
  })

  describe('input validation', () => {
    it('should reject empty email', async () => {
      const invalidInput = {
        ...validInput,
        email: '',
      }

      const result = await useCase.execute(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
        expect(result.error.message).toContain('E-Mail')
      }

      expect(mockUserRepository.emailExists).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })

    it('should reject invalid email format', async () => {
      const invalidInput = {
        ...validInput,
        email: 'invalid-email-format',
      }

      const result = await useCase.execute(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should reject empty first name', async () => {
      const invalidInput = {
        ...validInput,
        firstName: '',
      }

      const result = await useCase.execute(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should reject empty last name', async () => {
      const invalidInput = {
        ...validInput,
        lastName: '',
      }

      const result = await useCase.execute(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should reject weak password', async () => {
      const invalidInput = {
        ...validInput,
        password: '123',
      }

      const result = await useCase.execute(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
        expect(result.error.message).toContain('Passwort')
      }
    })
  })

  describe('business rule validation', () => {
    it('should reject duplicate email addresses', async () => {
      // Arrange
      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: true,
      })

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(DomainError)
        expect(result.error.message).toContain('E-Mail')
        expect(result.error.code).toBe('EMAIL_ALREADY_EXISTS')
      }

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(validInput.email)
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled()
    })

    it('should handle email existence check failure', async () => {
      // Arrange
      mockUserRepository.emailExists.mockResolvedValue({
        success: false,
        error: new Error('Database connection failed'),
      })

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toContain('Database connection failed')
      }

      expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('persistence failures', () => {
    it('should handle password hashing failure', async () => {
      // Arrange
      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockRejectedValue(new Error('Hashing failed'))

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toContain('Hashing failed')
      }

      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })

    it('should handle user save failure', async () => {
      // Arrange
      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.save.mockResolvedValue({
        success: false,
        error: new Error('Database save failed'),
      })

      // Act
      const result = await useCase.execute(validInput)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toContain('Database save failed')
      }

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User))
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in names', async () => {
      // Arrange
      const inputWithSpecialChars = {
        ...validInput,
        firstName: 'José',
        lastName: "O'Connor",
      }

      const createdUser = User.create({
        email: inputWithSpecialChars.email,
        firstName: inputWithSpecialChars.firstName,
        lastName: inputWithSpecialChars.lastName,
      })

      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.save.mockResolvedValue({
        success: true,
        data: createdUser,
      })

      // Act
      const result = await useCase.execute(inputWithSpecialChars)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.user.firstName).toBe('José')
        expect(result.data.user.lastName).toBe("O'Connor")
        expect(result.data.user.fullName).toBe("José O'Connor")
      }
    })

    it('should handle long names', async () => {
      // Arrange
      const inputWithLongNames = {
        ...validInput,
        firstName: 'A'.repeat(50),
        lastName: 'B'.repeat(50),
      }

      const createdUser = User.create({
        email: inputWithLongNames.email,
        firstName: inputWithLongNames.firstName,
        lastName: inputWithLongNames.lastName,
      })

      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.save.mockResolvedValue({
        success: true,
        data: createdUser,
      })

      // Act
      const result = await useCase.execute(inputWithLongNames)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.user.firstName).toBe('A'.repeat(50))
        expect(result.data.user.lastName).toBe('B'.repeat(50))
      }
    })

    it('should handle international email domains', async () => {
      // Arrange
      const inputWithInternationalEmail = {
        ...validInput,
        email: 'user@münchen.de',
      }

      const createdUser = User.create({
        email: inputWithInternationalEmail.email,
        firstName: inputWithInternationalEmail.firstName,
        lastName: inputWithInternationalEmail.lastName,
      })

      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: false,
      })
      mockPasswordHasher.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.save.mockResolvedValue({
        success: true,
        data: createdUser,
      })

      // Act
      const result = await useCase.execute(inputWithInternationalEmail)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.user.email).toBe('user@münchen.de')
      }
    })
  })

  describe('performance considerations', () => {
    it('should not call unnecessary services on validation failure', async () => {
      // Arrange
      const invalidInput = {
        ...validInput,
        email: 'invalid-email',
      }

      // Act
      await useCase.execute(invalidInput)

      // Assert - no external services should be called for invalid input
      expect(mockUserRepository.emailExists).not.toHaveBeenCalled()
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled()
    })

    it('should not call save service if email already exists', async () => {
      // Arrange
      mockUserRepository.emailExists.mockResolvedValue({
        success: true,
        data: true,
      })

      // Act
      await useCase.execute(validInput)

      // Assert
      expect(mockUserRepository.emailExists).toHaveBeenCalled()
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.save).not.toHaveBeenCalled()
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled()
    })
  })
})
