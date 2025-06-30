/**
 * Footer Component - Presentation Layer
 * Diese Komponente stellt die Fußzeile der Anwendung bereit
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils'
import { APP_CONFIG, ROUTES } from '@/shared/constants'

interface FooterProps {
  readonly className?: string
  readonly variant?: 'default' | 'minimal' | 'full'
}

export function Footer({ className, variant = 'default' }: FooterProps): JSX.Element {
  const currentYear = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className={cn('border-t bg-background', className)}>
        <div className="container flex items-center justify-center h-12 text-sm text-muted-foreground">
          © {currentYear} {APP_CONFIG.author}. Alle Rechte vorbehalten.
        </div>
      </footer>
    )
  }

  if (variant === 'full') {
    return (
      <footer className={cn('border-t bg-background', className)}>
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {APP_CONFIG.name.charAt(0)}
                  </span>
                </div>
                <span className="font-bold">{APP_CONFIG.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {APP_CONFIG.description}
              </p>
              <div className="flex space-x-4">
                <SocialLink href="#" icon="github" label="GitHub" />
                <SocialLink href="#" icon="twitter" label="Twitter" />
                <SocialLink href="#" icon="linkedin" label="LinkedIn" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={ROUTES.HOME} className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.ABOUT} className="text-muted-foreground hover:text-foreground transition-colors">
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.USERS} className="text-muted-foreground hover:text-foreground transition-colors">
                    Benutzer
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.DASHBOARD} className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold">Ressourcen</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dokumentation
                  </a>
                </li>
                <li>
                  <a href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold">Rechtliches</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    AGB
                  </a>
                </li>
                <li>
                  <a href="/imprint" className="text-muted-foreground hover:text-foreground transition-colors">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {APP_CONFIG.author}. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Version {APP_CONFIG.version}</span>
              <span>•</span>
              <a href="/status" className="hover:text-foreground transition-colors">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Default Footer
  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {APP_CONFIG.author}. Alle Rechte vorbehalten.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-4 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Datenschutz
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                AGB
              </a>
              <a href="/imprint" className="text-muted-foreground hover:text-foreground transition-colors">
                Impressum
              </a>
            </nav>
            
            <div className="flex space-x-3">
              <SocialLink href={APP_CONFIG.repository} icon="github" label="GitHub" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Social Link Component
interface SocialLinkProps {
  readonly href: string
  readonly icon: 'github' | 'twitter' | 'linkedin' | 'facebook' | 'instagram'
  readonly label: string
}

function SocialLink({ href, icon, label }: SocialLinkProps): JSX.Element {
  const icons = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.533l1.714-1.714c.39.39.927.633 1.491.633.564 0 1.101-.243 1.491-.633.39-.39.633-.927.633-1.491 0-.564-.243-1.101-.633-1.491-.39-.39-.927-.633-1.491-.633-.564 0-1.101.243-1.491.633L5.244 9.045c.757-.937 1.908-1.533 3.205-1.533 2.271 0 4.112 1.841 4.112 4.112s-1.841 4.112-4.112 4.112zm7.539 0c-1.297 0-2.448-.596-3.205-1.533l1.714-1.714c.39.39.927.633 1.491.633.564 0 1.101-.243 1.491-.633.39-.39.633-.927.633-1.491 0-.564-.243-1.101-.633-1.491-.39-.39-.927-.633-1.491-.633-.564 0-1.101.243-1.491.633l-1.714-1.714c.757-.937 1.908-1.533 3.205-1.533 2.271 0 4.112 1.841 4.112 4.112s-1.841 4.112-4.112 4.112z"/>
      </svg>
    ),
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label={label}
    >
      {icons[icon]}
    </a>
  )
}

// Newsletter Signup Component (für Full Footer)
function NewsletterSignup(): JSX.Element {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubscribed, setIsSubscribed] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuliere Newsletter-Anmeldung
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <div className="text-center text-green-600 dark:text-green-400">
        ✓ Erfolgreich für Newsletter angemeldet!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ihre E-Mail-Adresse"
          required
          className="flex-1 px-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Lädt...' : 'Abonnieren'}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Wir senden Ihnen keine Spam-E-Mails. Jederzeit abbestellbar.
      </p>
    </form>
  )
}

// Footer mit Newsletter (erweiterte Variante)
export function FooterWithNewsletter({ className }: Pick<FooterProps, 'className'>): JSX.Element {
  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="container py-8">
        {/* Newsletter Section */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">
              Bleiben Sie auf dem Laufenden
            </h3>
            <p className="text-muted-foreground mb-4">
              Erhalten Sie die neuesten Updates und Features direkt in Ihr Postfach.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Regular Footer Content */}
        <Footer variant="default" className="border-t-0" />
      </div>
    </footer>
  )
}
