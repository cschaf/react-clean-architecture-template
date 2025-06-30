/**
 * Local Storage Service - Infrastructure Layer
 * Diese Klasse stellt eine typsichere Abstraktion für Browser Local Storage bereit
 */

import { STORAGE_KEYS } from '@/shared/constants'
import { safeJsonParse } from '@/shared/utils'

export interface StorageService {
  get<T>(key: string, defaultValue: T): T
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  exists(key: string): boolean
  getAllKeys(): string[]
}

export class LocalStorageService implements StorageService {
  private readonly prefix: string

  constructor(prefix = 'app_') {
    this.prefix = prefix
  }

  public get<T>(key: string, defaultValue: T): T {
    try {
      if (!this.isLocalStorageAvailable()) {
        return defaultValue
      }

      const fullKey = this.getFullKey(key)
      const item = localStorage.getItem(fullKey)
      
      if (item === null) {
        return defaultValue
      }

      return safeJsonParse(item, defaultValue)
    } catch (error) {
      console.error(`Fehler beim Lesen aus LocalStorage (Key: ${key}):`, error)
      return defaultValue
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        console.warn('LocalStorage ist nicht verfügbar')
        return
      }

      const fullKey = this.getFullKey(key)
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(fullKey, serializedValue)
    } catch (error) {
      console.error(`Fehler beim Schreiben in LocalStorage (Key: ${key}):`, error)
    }
  }

  public remove(key: string): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        return
      }

      const fullKey = this.getFullKey(key)
      localStorage.removeItem(fullKey)
    } catch (error) {
      console.error(`Fehler beim Entfernen aus LocalStorage (Key: ${key}):`, error)
    }
  }

  public clear(): void {
    try {
      if (!this.isLocalStorageAvailable()) {
        return
      }

      // Entferne nur Keys mit unserem Prefix
      const keysToRemove = this.getAllKeys()
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Fehler beim Leeren des LocalStorage:', error)
    }
  }

  public exists(key: string): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false
      }

      const fullKey = this.getFullKey(key)
      return localStorage.getItem(fullKey) !== null
    } catch (error) {
      console.error(`Fehler beim Prüfen der LocalStorage-Existenz (Key: ${key}):`, error)
      return false
    }
  }

  public getAllKeys(): string[] {
    try {
      if (!this.isLocalStorageAvailable()) {
        return []
      }

      const allKeys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          allKeys.push(key)
        }
      }
      return allKeys
    } catch (error) {
      console.error('Fehler beim Abrufen aller LocalStorage-Keys:', error)
      return []
    }
  }

  public getSize(): number {
    try {
      if (!this.isLocalStorageAvailable()) {
        return 0
      }

      let totalSize = 0
      const keys = this.getAllKeys()
      
      keys.forEach(key => {
        const value = localStorage.getItem(key) || ''
        totalSize += key.length + value.length
      })
      
      return totalSize
    } catch (error) {
      console.error('Fehler beim Berechnen der LocalStorage-Größe:', error)
      return 0
    }
  }

  public getSizeFormatted(): string {
    const size = this.getSize()
    if (size < 1024) return `${size} Bytes`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

// Session Storage Alternative
export class SessionStorageService implements StorageService {
  private readonly prefix: string

  constructor(prefix = 'app_') {
    this.prefix = prefix
  }

  public get<T>(key: string, defaultValue: T): T {
    try {
      if (!this.isSessionStorageAvailable()) {
        return defaultValue
      }

      const fullKey = this.getFullKey(key)
      const item = sessionStorage.getItem(fullKey)
      
      if (item === null) {
        return defaultValue
      }

      return safeJsonParse(item, defaultValue)
    } catch (error) {
      console.error(`Fehler beim Lesen aus SessionStorage (Key: ${key}):`, error)
      return defaultValue
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      if (!this.isSessionStorageAvailable()) {
        console.warn('SessionStorage ist nicht verfügbar')
        return
      }

      const fullKey = this.getFullKey(key)
      const serializedValue = JSON.stringify(value)
      sessionStorage.setItem(fullKey, serializedValue)
    } catch (error) {
      console.error(`Fehler beim Schreiben in SessionStorage (Key: ${key}):`, error)
    }
  }

  public remove(key: string): void {
    try {
      if (!this.isSessionStorageAvailable()) {
        return
      }

      const fullKey = this.getFullKey(key)
      sessionStorage.removeItem(fullKey)
    } catch (error) {
      console.error(`Fehler beim Entfernen aus SessionStorage (Key: ${key}):`, error)
    }
  }

  public clear(): void {
    try {
      if (!this.isSessionStorageAvailable()) {
        return
      }

      const keysToRemove = this.getAllKeys()
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Fehler beim Leeren des SessionStorage:', error)
    }
  }

  public exists(key: string): boolean {
    try {
      if (!this.isSessionStorageAvailable()) {
        return false
      }

      const fullKey = this.getFullKey(key)
      return sessionStorage.getItem(fullKey) !== null
    } catch (error) {
      console.error(`Fehler beim Prüfen der SessionStorage-Existenz (Key: ${key}):`, error)
      return false
    }
  }

  public getAllKeys(): string[] {
    try {
      if (!this.isSessionStorageAvailable()) {
        return []
      }

      const allKeys: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          allKeys.push(key)
        }
      }
      return allKeys
    } catch (error) {
      console.error('Fehler beim Abrufen aller SessionStorage-Keys:', error)
      return []
    }
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const testKey = '__sessionStorage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

// In-Memory Storage als Fallback
export class InMemoryStorageService implements StorageService {
  private readonly storage = new Map<string, string>()
  private readonly prefix: string

  constructor(prefix = 'app_') {
    this.prefix = prefix
  }

  public get<T>(key: string, defaultValue: T): T {
    const fullKey = this.getFullKey(key)
    const item = this.storage.get(fullKey)
    
    if (item === undefined) {
      return defaultValue
    }

    return safeJsonParse(item, defaultValue)
  }

  public set<T>(key: string, value: T): void {
    const fullKey = this.getFullKey(key)
    const serializedValue = JSON.stringify(value)
    this.storage.set(fullKey, serializedValue)
  }

  public remove(key: string): void {
    const fullKey = this.getFullKey(key)
    this.storage.delete(fullKey)
  }

  public clear(): void {
    // Entferne nur Keys mit unserem Prefix
    const keysToRemove = this.getAllKeys()
    keysToRemove.forEach(key => {
      this.storage.delete(key)
    })
  }

  public exists(key: string): boolean {
    const fullKey = this.getFullKey(key)
    return this.storage.has(fullKey)
  }

  public getAllKeys(): string[] {
    return Array.from(this.storage.keys()).filter(key => key.startsWith(this.prefix))
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }
}

// Typsichere Wrapper für spezifische Storage-Needs
export class AppStorageService {
  constructor(private readonly storage: StorageService) {}

  // User Token
  public getUserToken(): string | null {
    return this.storage.get(STORAGE_KEYS.USER_TOKEN, null)
  }

  public setUserToken(token: string): void {
    this.storage.set(STORAGE_KEYS.USER_TOKEN, token)
  }

  public removeUserToken(): void {
    this.storage.remove(STORAGE_KEYS.USER_TOKEN)
  }

  // User Preferences
  public getUserPreferences(): Record<string, unknown> {
    return this.storage.get(STORAGE_KEYS.USER_PREFERENCES, {})
  }

  public setUserPreferences(preferences: Record<string, unknown>): void {
    this.storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences)
  }

  // Theme
  public getTheme(): string {
    return this.storage.get(STORAGE_KEYS.THEME, 'system')
  }

  public setTheme(theme: string): void {
    this.storage.set(STORAGE_KEYS.THEME, theme)
  }

  // Language
  public getLanguage(): string {
    return this.storage.get(STORAGE_KEYS.LANGUAGE, 'de')
  }

  public setLanguage(language: string): void {
    this.storage.set(STORAGE_KEYS.LANGUAGE, language)
  }

  // Clear all app data
  public clearAllData(): void {
    this.storage.clear()
  }
}

// Factory für verschiedene Storage-Implementierungen
export class StorageServiceFactory {
  public static createLocalStorage(prefix?: string): StorageService {
    return new LocalStorageService(prefix)
  }

  public static createSessionStorage(prefix?: string): StorageService {
    return new SessionStorageService(prefix)
  }

  public static createInMemoryStorage(prefix?: string): StorageService {
    return new InMemoryStorageService(prefix)
  }

  public static createDefault(): StorageService {
    // Prüfe Verfügbarkeit und wähle beste Option
    try {
      const localStorage = new LocalStorageService()
      localStorage.set('__test__', 'test')
      localStorage.remove('__test__')
      return localStorage
    } catch {
      try {
        const sessionStorage = new SessionStorageService()
        sessionStorage.set('__test__', 'test')
        sessionStorage.remove('__test__')
        return sessionStorage
      } catch {
        return new InMemoryStorageService()
      }
    }
  }

  public static createAppStorage(storage?: StorageService): AppStorageService {
    return new AppStorageService(storage || this.createDefault())
  }
}
