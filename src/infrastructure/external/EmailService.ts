/**
 * Email Service - Infrastructure Layer
 * Diese Klasse implementiert das Versenden von E-Mails
 */

import { EmailService } from '@/domain/use-cases/CreateUser'

export interface EmailTemplate {
  readonly subject: string
  readonly htmlBody: string
  readonly textBody: string
}

export interface EmailServiceConfig {
  readonly apiKey?: string
  readonly fromEmail: string
  readonly fromName: string
  readonly baseUrl?: string
}

export class MockEmailService implements EmailService {
  private readonly config: EmailServiceConfig
  private readonly sentEmails: Array<{
    to: string
    subject: string
    body: string
    sentAt: Date
  }> = []

  constructor(config: EmailServiceConfig) {
    this.config = config
  }

  public async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const template = this.getWelcomeTemplate(firstName)
    await this.sendEmail(email, template)
    
    // Log für Demo-Zwecke
    console.log(`Willkommens-E-Mail gesendet an: ${email}`)
  }

  public async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const template = this.getPasswordResetTemplate(resetToken)
    await this.sendEmail(email, template)
    
    console.log(`Passwort-Reset-E-Mail gesendet an: ${email}`)
  }

  public async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const template = this.getVerificationTemplate(verificationToken)
    await this.sendEmail(email, template)
    
    console.log(`Verifizierungs-E-Mail gesendet an: ${email}`)
  }

  public async sendNotificationEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    const template = this.getNotificationTemplate(subject, message)
    await this.sendEmail(email, template)
    
    console.log(`Benachrichtigungs-E-Mail gesendet an: ${email}`)
  }

  private async sendEmail(email: string, template: EmailTemplate): Promise<void> {
    // Mock-Implementierung - in der realen Anwendung würde hier ein echter E-Mail-Service aufgerufen
    await this.delay(100) // Simuliere Netzwerk-Delay
    
    this.sentEmails.push({
      to: email,
      subject: template.subject,
      body: template.htmlBody,
      sentAt: new Date(),
    })
  }

  private getWelcomeTemplate(firstName: string): EmailTemplate {
    return {
      subject: 'Willkommen bei unserer Anwendung!',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Willkommen, ${firstName}!</h1>
          <p>Vielen Dank für Ihre Registrierung bei unserer Anwendung.</p>
          <p>Sie können sich jetzt anmelden und alle Funktionen nutzen.</p>
          <div style="margin: 30px 0;">
            <a href="${this.config.baseUrl}/login" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Jetzt anmelden
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Mit freundlichen Grüßen,<br>
            Das ${this.config.fromName} Team
          </p>
        </div>
      `,
      textBody: `
        Willkommen, ${firstName}!
        
        Vielen Dank für Ihre Registrierung bei unserer Anwendung.
        Sie können sich jetzt anmelden und alle Funktionen nutzen.
        
        Anmelden: ${this.config.baseUrl}/login
        
        Mit freundlichen Grüßen,
        Das ${this.config.fromName} Team
      `,
    }
  }

  private getPasswordResetTemplate(resetToken: string): EmailTemplate {
    const resetUrl = `${this.config.baseUrl}/reset-password?token=${resetToken}`
    
    return {
      subject: 'Passwort zurücksetzen',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Passwort zurücksetzen</h1>
          <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
          <p>Klicken Sie auf den folgenden Link, um ein neues Passwort zu erstellen:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Passwort zurücksetzen
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Dieser Link ist 1 Stunde gültig. Falls Sie keine Anfrage gestellt haben, können Sie diese E-Mail ignorieren.
          </p>
        </div>
      `,
      textBody: `
        Passwort zurücksetzen
        
        Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.
        Klicken Sie auf den folgenden Link, um ein neues Passwort zu erstellen:
        
        ${resetUrl}
        
        Dieser Link ist 1 Stunde gültig. Falls Sie keine Anfrage gestellt haben, können Sie diese E-Mail ignorieren.
      `,
    }
  }

  private getVerificationTemplate(verificationToken: string): EmailTemplate {
    const verificationUrl = `${this.config.baseUrl}/verify-email?token=${verificationToken}`
    
    return {
      subject: 'E-Mail-Adresse bestätigen',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">E-Mail-Adresse bestätigen</h1>
          <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              E-Mail bestätigen
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Dieser Link ist 24 Stunden gültig.
          </p>
        </div>
      `,
      textBody: `
        E-Mail-Adresse bestätigen
        
        Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.
        
        ${verificationUrl}
        
        Dieser Link ist 24 Stunden gültig.
      `,
    }
  }

  private getNotificationTemplate(subject: string, message: string): EmailTemplate {
    return {
      subject,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${subject}</h1>
          <div style="line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Mit freundlichen Grüßen,<br>
            Das ${this.config.fromName} Team
          </p>
        </div>
      `,
      textBody: `
        ${subject}
        
        ${message}
        
        Mit freundlichen Grüßen,
        Das ${this.config.fromName} Team
      `,
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Debug-Methoden für Tests
  public getSentEmails(): ReadonlyArray<{
    to: string
    subject: string
    body: string
    sentAt: Date
  }> {
    return [...this.sentEmails]
  }

  public clearSentEmails(): void {
    this.sentEmails.length = 0
  }
}

// SendGrid-Implementierung als Beispiel für einen echten Service
export class SendGridEmailService implements EmailService {
  private readonly config: EmailServiceConfig

  constructor(config: EmailServiceConfig) {
    this.config = config
  }

  public async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    // Implementierung mit SendGrid API
    throw new Error('SendGrid-Implementierung noch nicht verfügbar')
  }

  // Weitere Methoden...
}

// Factory für verschiedene E-Mail-Services
export class EmailServiceFactory {
  public static createMock(config: EmailServiceConfig): EmailService {
    return new MockEmailService(config)
  }

  public static createSendGrid(config: EmailServiceConfig): EmailService {
    return new SendGridEmailService(config)
  }

  public static createDefault(): EmailService {
    return new MockEmailService({
      fromEmail: 'noreply@example.com',
      fromName: 'React App',
      baseUrl: 'http://localhost:5173',
    })
  }
}
