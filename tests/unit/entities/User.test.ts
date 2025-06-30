import { describe, it, expect } from 'vitest'
import { User } from '@/domain/entities'
import { ValidationError } from '@/shared/types'

describe('User Entity', () => {
  const validUserData = {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  }

  describe('creation', () => {
    it('should create user with valid data', () => {
      const user = User.create(validUserData)

      expect(user.id).toBeDefined()
      expect(user.email).toBe('john.doe@example.com')
      expect(user.firstName).toBe('John')
      expect(user.lastName).toBe('Doe')
      expect(user.fullName).toBe('John Doe')
      expect(user.isActive).toBe(true)
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('should generate unique IDs for different users', () => {
      const user1 = User.create(validUserData)
      const user2 = User.create({
        ...validUserData,
        email: 'jane@example.com',
      })

      expect(user1.id).not.toBe(user2.id)
    })

    it('should validate email format on creation', () => {
      expect(() =>
        User.create({
          ...validUserData,
          email: 'invalid-email',
        })
      ).toThrow(ValidationError)
    })

    it('should require first name', () => {
      expect(() =>
        User.create({
          ...validUserData,
          firstName: '',
        })
      ).toThrow(ValidationError)
    })

    it('should require last name', () => {
      expect(() =>
        User.create({
          ...validUserData,
          lastName: '',
        })
      ).toThrow(ValidationError)
    })
  })

  describe('fromPersistence', () => {
    it('should restore user from persistence data', () => {
      const persistenceData = {
        id: 'existing-user-id',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        roles: ['user'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      }

      const user = User.fromPersistence(persistenceData)

      expect(user.id).toBe('existing-user-id')
      expect(user.email).toBe('john@example.com')
      expect(user.fullName).toBe('John Doe')
      expect(user.isActive).toBe(true)
      expect(user.createdAt).toEqual(new Date('2023-01-01'))
      expect(user.updatedAt).toEqual(new Date('2023-01-02'))
    })
  })

  describe('business methods', () => {
    it('should allow profile updates for active users', () => {
      const user = User.create(validUserData)

      const updatedUser = user.updateProfile({
        firstName: 'Jane',
        lastName: 'Smith',
      })

      expect(updatedUser.firstName).toBe('Jane')
      expect(updatedUser.lastName).toBe('Smith')
      expect(updatedUser.fullName).toBe('Jane Smith')
      expect(updatedUser.email).toBe(user.email) // Unchanged
      expect(updatedUser.id).toBe(user.id) // Preserves identity
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime())
    })

    it('should allow email updates with validation', () => {
      const user = User.create(validUserData)

      const updatedUser = user.updateProfile({
        email: 'newemail@example.com',
      })

      expect(updatedUser.email).toBe('newemail@example.com')
      expect(updatedUser.firstName).toBe(user.firstName) // Unchanged
      expect(updatedUser.lastName).toBe(user.lastName) // Unchanged
    })

    it('should validate email format on updates', () => {
      const user = User.create(validUserData)

      expect(() =>
        user.updateProfile({
          email: 'invalid-email-format',
        })
      ).toThrow(ValidationError)
    })

    it('should check if user can perform actions when active', () => {
      const user = User.create(validUserData)

      expect(user.canLogin()).toBe(true)
    })

    it('should deny actions for inactive users', () => {
      const inactiveUserData = {
        id: 'test-id',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: false,
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const user = User.fromPersistence(inactiveUserData)

      expect(user.canLogin()).toBe(false)
    })

    it('should check user roles', () => {
      const adminUserData = {
        id: 'admin-id',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        roles: ['admin', 'user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const user = User.fromPersistence(adminUserData)

      expect(user.hasRole('admin')).toBe(true)
      expect(user.hasRole('user')).toBe(true)
      expect(user.hasRole('moderator')).toBe(false)
    })
  })

  describe('immutability', () => {
    it('should create new instance on updates', () => {
      const originalUser = User.create(validUserData)
      const updatedUser = originalUser.updateProfile({
        firstName: 'Jane',
      })

      // Should be different instances
      expect(updatedUser).not.toBe(originalUser)

      // Original should remain unchanged
      expect(originalUser.firstName).toBe('John')
      expect(updatedUser.firstName).toBe('Jane')

      // Identity should be preserved
      expect(updatedUser.id).toBe(originalUser.id)
      expect(updatedUser.email).toBe(originalUser.email)
    })

    it('should preserve creation timestamp on updates', () => {
      const originalUser = User.create(validUserData)
      const updatedUser = originalUser.updateProfile({
        firstName: 'Jane',
      })

      expect(updatedUser.createdAt).toEqual(originalUser.createdAt)
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        originalUser.updatedAt.getTime()
      )
    })
  })

  describe('computed properties', () => {
    it('should compute full name correctly', () => {
      const user = User.create({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(user.fullName).toBe('John Doe')
    })

    it('should compute display email correctly', () => {
      const user = User.create(validUserData)

      expect(user.displayEmail).toBe('john.doe@example.com')
    })

    it('should compute initials correctly', () => {
      const user = User.create(validUserData)

      expect(user.initials).toBe('JD')
    })

    it('should handle short names for initials', () => {
      const user = User.create({
        email: 'al.bo@example.com',
        firstName: 'Al',
        lastName: 'Bo',
      })

      expect(user.initials).toBe('AB')
    })
  })

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      const user = User.create(validUserData)
      const json = user.toJSON()

      expect(json).toEqual({
        id: user.id,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        roles: ['user'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })
    })

    it('should provide debug string representation', () => {
      const user = User.create(validUserData)
      const debugString = user.toDebugString()

      expect(debugString).toContain('User')
      expect(debugString).toContain(user.id)
      expect(debugString).toContain('john.doe@example.com')
      expect(debugString).toContain('John Doe')
    })
  })
})
