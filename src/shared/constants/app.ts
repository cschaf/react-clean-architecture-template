/**
 * Anwendungsweite Konstanten
 * Diese Datei enthält alle zentralen Konfigurationswerte der Anwendung
 */

export const APP_CONFIG = {
  name: 'React Clean Architecture Template',
  version: '1.0.0',
  description: 'Ein modernes React-Template mit Clean Architecture-Prinzipien',
  author: 'Christian Schaf',
  repository: 'https://github.com/cschaf/react-clean-architecture-template',
} as const

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const

export const ROUTES = {
  HOME: '/react-clean-architecture-template',
  ABOUT: '/about',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '/404',
} as const

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export const LANGUAGES = {
  DE: 'de',
  EN: 'en',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const
