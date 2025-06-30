/**
 * Gemeinsame Validierungsschemas
 * Diese Datei enthält wiederverwendbare Validierungslogik mit Zod
 */

import { z } from 'zod'
import { VALIDATION_RULES } from '@/shared/constants/app'

// Base Schemas
export const idSchema = z.string().min(1, 'ID ist erforderlich')

export const emailSchema = z
  .string()
  .min(1, 'E-Mail ist erforderlich')
  .email('Ungültige E-Mail-Adresse')
  .regex(VALIDATION_RULES.EMAIL_REGEX, 'Ungültiges E-Mail-Format')

export const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Passwort muss mindestens ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} Zeichen haben`)
  .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
  .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
  .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
  .regex(/[^A-Za-z0-9]/, 'Passwort muss mindestens ein Sonderzeichen enthalten')

export const usernameSchema = z
  .string()
  .min(VALIDATION_RULES.USERNAME_MIN_LENGTH, `Benutzername muss mindestens ${VALIDATION_RULES.USERNAME_MIN_LENGTH} Zeichen haben`)
  .max(VALIDATION_RULES.USERNAME_MAX_LENGTH, `Benutzername darf maximal ${VALIDATION_RULES.USERNAME_MAX_LENGTH} Zeichen haben`)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Benutzername darf nur Buchstaben, Zahlen, Bindestriche und Unterstriche enthalten')

export const nameSchema = z
  .string()
  .min(1, 'Name ist erforderlich')
  .max(50, 'Name darf maximal 50 Zeichen haben')
  .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, 'Name darf nur Buchstaben, Leerzeichen und Bindestriche enthalten')

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Ungültiges Telefonnummer-Format')
  .optional()

export const urlSchema = z
  .string()
  .url('Ungültige URL')
  .optional()

export const dateSchema = z
  .string()
  .datetime('Ungültiges Datumsformat')
  .or(z.date())

export const positiveNumberSchema = z
  .number()
  .positive('Wert muss positiv sein')

export const priceSchema = z
  .number()
  .min(0, 'Preis muss mindestens 0 sein')
  .max(999999.99, 'Preis ist zu hoch')

// Address Schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Straße ist erforderlich'),
  city: z.string().min(1, 'Stadt ist erforderlich'),
  postalCode: z.string().regex(/^\d{5}$/, 'Ungültige Postleitzahl'),
  country: z.string().min(1, 'Land ist erforderlich'),
  state: z.string().optional(),
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Seite muss mindestens 1 sein').default(1),
  pageSize: z
    .number()
    .min(5, 'Seitengröße muss mindestens 5 sein')
    .max(100, 'Seitengröße darf maximal 100 sein')
    .default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

// Filter Schema
export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
})

// User Validation Schemas
export const createUserSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
})

export const updateUserSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  avatar: urlSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

export const registerSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Aktuelles Passwort ist erforderlich'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })

// Product Validation Schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Produktname ist erforderlich').max(100, 'Produktname zu lang'),
  description: z.string().min(1, 'Beschreibung ist erforderlich').max(1000, 'Beschreibung zu lang'),
  price: priceSchema,
  categoryId: idSchema,
  images: z.array(urlSchema).optional(),
  inStock: z.number().min(0, 'Lagerbestand muss mindestens 0 sein'),
  tags: z.array(z.string()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

// Order Validation Schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: idSchema,
        quantity: z.number().min(1, 'Menge muss mindestens 1 sein'),
      })
    )
    .min(1, 'Mindestens ein Artikel ist erforderlich'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.object({
    type: z.enum(['credit_card', 'paypal', 'bank_transfer']),
    details: z.record(z.unknown()),
  }),
  notes: z.string().max(500, 'Notizen zu lang').optional(),
})

// Settings Validation Schemas
export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['de', 'en']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
    orderUpdates: z.boolean(),
  }),
  privacy: z.object({
    profileVisible: z.boolean(),
    allowAnalytics: z.boolean(),
    allowCookies: z.boolean(),
  }),
})

// Contact Form Schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Betreff ist erforderlich').max(100, 'Betreff zu lang'),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben').max(1000, 'Nachricht zu lang'),
})

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Suchbegriff ist erforderlich').max(100, 'Suchbegriff zu lang'),
  filters: z.record(z.string()).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(50).default(10),
})

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Datei ist erforderlich' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
})

// Newsletter Schema
export const newsletterSchema = z.object({
  email: emailSchema,
  preferences: z.object({
    weekly: z.boolean().default(true),
    monthly: z.boolean().default(false),
    special: z.boolean().default(true),
  }),
})

// API Response Schema
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  })

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
  success: z.literal(false),
})

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type FilterInput = z.infer<typeof filterSchema>
