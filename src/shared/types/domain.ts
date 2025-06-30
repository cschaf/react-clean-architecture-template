/**
 * Domain-spezifische Typen
 * Diese Datei definiert Typen für die Geschäftslogik
 */

import { BaseEntity } from './common'

// User Domain Types
export interface User extends BaseEntity {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly avatar?: string
  readonly isActive: boolean
  readonly roles: string[]
  readonly lastLoginAt?: Date
}

export interface CreateUserData {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly password: string
}

export interface UpdateUserData {
  readonly firstName?: string
  readonly lastName?: string
  readonly avatar?: string
}

// Authentication Types
export interface AuthUser {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly roles: string[]
}

export interface LoginCredentials {
  readonly email: string
  readonly password: string
}

export interface RegisterData {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly password: string
  readonly confirmPassword: string
}

export interface AuthTokens {
  readonly accessToken: string
  readonly refreshToken: string
  readonly expiresAt: Date
}

// Product Domain Types (Beispiel für E-Commerce)
export interface Product extends BaseEntity {
  readonly name: string
  readonly description: string
  readonly price: number
  readonly currency: string
  readonly category: ProductCategory
  readonly images: string[]
  readonly inStock: number
  readonly isActive: boolean
  readonly tags: string[]
}

export interface ProductCategory extends BaseEntity {
  readonly name: string
  readonly description?: string
  readonly parentId?: string
  readonly isActive: boolean
}

export interface CreateProductData {
  readonly name: string
  readonly description: string
  readonly price: number
  readonly categoryId: string
  readonly images?: string[]
  readonly inStock: number
  readonly tags?: string[]
}

// Order Domain Types
export interface Order extends BaseEntity {
  readonly orderNumber: string
  readonly userId: string
  readonly items: OrderItem[]
  readonly status: OrderStatus
  readonly totalAmount: number
  readonly currency: string
  readonly shippingAddress: Address
  readonly billingAddress: Address
  readonly paymentMethod: PaymentMethod
  readonly notes?: string
}

export interface OrderItem {
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Address {
  readonly street: string
  readonly city: string
  readonly postalCode: string
  readonly country: string
  readonly state?: string
}

export interface PaymentMethod {
  readonly type: 'credit_card' | 'paypal' | 'bank_transfer'
  readonly details: Record<string, unknown>
}

// Notification Domain Types
export interface Notification extends BaseEntity {
  readonly userId: string
  readonly title: string
  readonly message: string
  readonly type: NotificationType
  readonly isRead: boolean
  readonly actionUrl?: string
  readonly metadata?: Record<string, unknown>
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'

// Settings Domain Types
export interface UserSettings {
  readonly userId: string
  readonly theme: 'light' | 'dark' | 'system'
  readonly language: 'de' | 'en'
  readonly notifications: NotificationSettings
  readonly privacy: PrivacySettings
}

export interface NotificationSettings {
  readonly email: boolean
  readonly push: boolean
  readonly marketing: boolean
  readonly orderUpdates: boolean
}

export interface PrivacySettings {
  readonly profileVisible: boolean
  readonly allowAnalytics: boolean
  readonly allowCookies: boolean
}

// Analytics Domain Types
export interface AnalyticsEvent {
  readonly name: string
  readonly properties: Record<string, unknown>
  readonly userId?: string
  readonly sessionId: string
  readonly timestamp: Date
}

export interface AnalyticsMetrics {
  readonly pageViews: number
  readonly uniqueVisitors: number
  readonly bounceRate: number
  readonly avgSessionDuration: number
  readonly conversionRate: number
}
