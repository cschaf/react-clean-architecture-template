/**
 * User Entity - Domain Layer
 * Diese Klasse repräsentiert die Geschäftslogik für Benutzer
 */

import { BaseEntity, DomainError, ValidationError } from '@/shared/types'
import { VALIDATION_RULES } from '@/shared/constants'

export interface UserProps {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly avatar?: string
  readonly isActive: boolean
  readonly roles: string[]
  readonly lastLoginAt?: Date
  readonly createdAt: Date
  readonly updatedAt: Date
}

export class User implements BaseEntity {
  private constructor(private readonly props: UserProps) {
    this.validateEmail(props.email)
    this.validateName(props.firstName, 'Vorname')
    this.validateName(props.lastName, 'Nachname')
  }

  public static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date()
    return new User({
      // Start with provided props
      ...props,
      // Set defaults only if not provided
      isActive: props.isActive ?? true,
      roles: props.roles ?? ['user'],
      // Always set these values
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
  }

  public static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  // Getter für Properties
  public get id(): string {
    return this.props.id
  }

  public get email(): string {
    return this.props.email
  }

  public get firstName(): string {
    return this.props.firstName
  }

  public get lastName(): string {
    return this.props.lastName
  }

  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`
  }

  public get displayEmail(): string {
    return this.props.email
  }

  public get initials(): string {
    const firstInitial = this.props.firstName.charAt(0).toUpperCase()
    const lastInitial = this.props.lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  public get avatar(): string | undefined {
    return this.props.avatar
  }

  public get isActive(): boolean {
    return this.props.isActive
  }

  public get roles(): readonly string[] {
    return [...this.props.roles]
  }

  public get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Business Logic Methods
  public updateProfile(updates: {
    firstName?: string
    lastName?: string
    email?: string
    avatar?: string
  }): User {
    if (updates.firstName) {
      this.validateName(updates.firstName, 'Vorname')
    }
    if (updates.lastName) {
      this.validateName(updates.lastName, 'Nachname')
    }
    if (updates.email) {
      this.validateEmail(updates.email)
    }

    // Ensure updatedAt is different from original
    const now = new Date()
    if (now.getTime() === this.props.updatedAt.getTime()) {
      now.setMilliseconds(now.getMilliseconds() + 1)
    }
    
    return new User({
      ...this.props,
      ...updates,
      updatedAt: now,
    })
  }

  public changeEmail(newEmail: string): User {
    this.validateEmail(newEmail)
    
    if (newEmail === this.props.email) {
      throw new DomainError('Neue E-Mail ist identisch mit der aktuellen E-Mail', 'EMAIL_UNCHANGED')
    }

    return new User({
      ...this.props,
      email: newEmail,
      updatedAt: new Date(),
    })
  }

  public activate(): User {
    if (this.props.isActive) {
      throw new DomainError('Benutzer ist bereits aktiv', 'USER_ALREADY_ACTIVE')
    }

    return new User({
      ...this.props,
      isActive: true,
      updatedAt: new Date(),
    })
  }

  public deactivate(): User {
    if (!this.props.isActive) {
      throw new DomainError('Benutzer ist bereits deaktiviert', 'USER_ALREADY_INACTIVE')
    }

    return new User({
      ...this.props,
      isActive: false,
      updatedAt: new Date(),
    })
  }

  public updateLastLogin(): User {
    return new User({
      ...this.props,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
  }

  public addRole(role: string): User {
    if (this.props.roles.includes(role)) {
      throw new DomainError(`Benutzer hat bereits die Rolle: ${role}`, 'ROLE_ALREADY_EXISTS')
    }

    return new User({
      ...this.props,
      roles: [...this.props.roles, role],
      updatedAt: new Date(),
    })
  }

  public removeRole(role: string): User {
    if (!this.props.roles.includes(role)) {
      throw new DomainError(`Benutzer hat die Rolle nicht: ${role}`, 'ROLE_NOT_FOUND')
    }

    return new User({
      ...this.props,
      roles: this.props.roles.filter(r => r !== role),
      updatedAt: new Date(),
    })
  }

  public hasRole(role: string): boolean {
    return this.props.roles.includes(role)
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.props.roles.includes(role))
  }

  public hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.props.roles.includes(role))
  }

  public canLogin(): boolean {
    return this.props.isActive
  }

  public isNewUser(): boolean {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return this.props.createdAt > oneWeekAgo
  }

  // Serialization
  public toPlainObject(): UserProps {
    return { ...this.props }
  }

  public toPublicObject(): Omit<UserProps, 'roles' | 'lastLoginAt'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roles, lastLoginAt, ...publicProps } = this.props
    return publicProps
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.props.id,
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      fullName: this.fullName,
      isActive: this.props.isActive,
      roles: this.props.roles ? [...this.props.roles] : [],
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    }
  }

  public toDebugString(): string {
    return `User(id=${this.props.id}, email=${this.props.email}, fullName=${this.fullName}, isActive=${this.props.isActive})`
  }

  // Private Validation Methods
  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationError('E-Mail ist erforderlich', 'email')
    }

    if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
      throw new ValidationError('Ungültige E-Mail-Adresse', 'email')
    }
  }

  private validateName(name: string, fieldName: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError(`${fieldName} ist erforderlich`, fieldName.toLowerCase())
    }

    if (name.length < 2) {
      throw new ValidationError(`${fieldName} muss mindestens 2 Zeichen haben`, fieldName.toLowerCase())
    }

    if (name.length > 50) {
      throw new ValidationError(`${fieldName} darf maximal 50 Zeichen haben`, fieldName.toLowerCase())
    }

    if (!/^[a-zA-ZäöüÄÖÜßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ\s-']+$/.test(name)) {
      throw new ValidationError(
        `${fieldName} darf nur Buchstaben, Leerzeichen, Bindestriche und Apostrophe enthalten`,
        fieldName.toLowerCase()
      )
    }
  }
}
