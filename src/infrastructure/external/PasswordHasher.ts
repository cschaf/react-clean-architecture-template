/**
 * Password Hasher - Infrastructure Layer
 * Diese Klasse implementiert das Hashen von Passwörtern
 */

import { PasswordHasher } from '@/domain/use-cases/CreateUser'

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number

  constructor(saltRounds = 12) {
    this.saltRounds = saltRounds
  }

  public async hash(password: string): Promise<string> {
    // In einer echten Implementierung würde hier bcrypt verwendet
    // Hier verwenden wir eine einfache Mock-Implementierung
    return this.mockHash(password)
  }

  public async verify(password: string, hash: string): Promise<boolean> {
    // In einer echten Implementierung würde hier bcrypt.compare verwendet
    const expectedHash = await this.mockHash(password)
    return expectedHash === hash
  }

  private async mockHash(password: string): Promise<string> {
    // Mock-Implementierung für Demo-Zwecke
    // In der realen Anwendung: import bcrypt from 'bcryptjs'; return bcrypt.hash(password, this.saltRounds)
    
    // Einfache Simulation des Hashings mit Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'salt')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

// Alternative Implementierung mit Web Crypto API für Browser
export class WebCryptoPasswordHasher implements PasswordHasher {
  private readonly iterations: number

  constructor(iterations = 100000) {
    this.iterations = iterations
  }

  public async hash(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)

    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.iterations,
        hash: 'SHA-256',
      },
      key,
      256
    )

    const hashArray = Array.from(new Uint8Array(derivedBits))
    const saltArray = Array.from(salt)
    
    // Kombiniere Salt und Hash
    const combined = saltArray.concat(hashArray)
    return combined.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  public async verify(password: string, hash: string): Promise<boolean> {
    try {
      // Extrahiere Salt und Hash
      const combined = hash.match(/.{2}/g)?.map(byte => parseInt(byte, 16))
      if (!combined || combined.length < 48) return false

      const salt = new Uint8Array(combined.slice(0, 16))
      const storedHash = combined.slice(16)

      const encoder = new TextEncoder()
      const passwordData = encoder.encode(password)

      const key = await crypto.subtle.importKey(
        'raw',
        passwordData,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      )

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.iterations,
          hash: 'SHA-256',
        },
        key,
        256
      )

      const computedHash = Array.from(new Uint8Array(derivedBits))
      
      // Vergleiche Hashes
      if (computedHash.length !== storedHash.length) return false
      
      let isValid = true
      for (let i = 0; i < computedHash.length; i++) {
        if (computedHash[i] !== storedHash[i]) {
          isValid = false
        }
      }
      
      return isValid
    } catch {
      return false
    }
  }
}

// Factory für verschiedene Implementierungen
export class PasswordHasherFactory {
  public static createBcrypt(saltRounds?: number): PasswordHasher {
    return new BcryptPasswordHasher(saltRounds)
  }

  public static createWebCrypto(iterations?: number): PasswordHasher {
    return new WebCryptoPasswordHasher(iterations)
  }

  public static createDefault(): PasswordHasher {
    // Verwende Web Crypto für Browser-Kompatibilität
    return new WebCryptoPasswordHasher()
  }
}
