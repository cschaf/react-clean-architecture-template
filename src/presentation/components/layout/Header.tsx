/**
 * Header Component - Presentation Layer
 * Diese Komponente stellt die Kopfzeile der Anwendung bereit
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/app/providers/ThemeProvider'
import { cn } from '@/shared/utils'
import { APP_CONFIG, ROUTES } from '@/shared/constants'

interface HeaderProps {
  readonly onToggleSidebar?: () => void
  readonly showSidebarToggle?: boolean
  readonly className?: string
}

export function Header({ onToggleSidebar, showSidebarToggle = false, className }: HeaderProps): JSX.Element {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-14 items-center">
        {/* Sidebar Toggle (Mobile/Desktop) */}
        {showSidebarToggle && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 mr-4"
            aria-label="Seitenleiste umschalten"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Logo/Brand */}
        <div className="mr-4 flex">
          <Link to={ROUTES.HOME} className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {APP_CONFIG.name.charAt(0)}
              </span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {APP_CONFIG.name}
            </span>
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
          <Link
            to={ROUTES.HOME}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            to={ROUTES.ABOUT}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Über uns
          </Link>
          <Link
            to={ROUTES.USERS}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Benutzer
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search could go here */}
          </div>
          
          {/* Action Buttons */}
          <nav className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              aria-label="Theme wechseln"
            >
              {theme === 'dark' ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Menu */}
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  )
}

// User Menu Component
function UserMenu(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
        aria-label="Benutzermenü"
      >
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              to={ROUTES.DASHBOARD}
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Einstellungen
            </Link>
            <hr className="my-1" />
            <Link
              to={ROUTES.LOGIN}
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Anmelden
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                // Hier würde Logout-Logik implementiert werden
                console.log('Abmelden')
              }}
            >
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Search Component (für zukünftige Erweiterung)
interface SearchProps {
  readonly placeholder?: string
  readonly onSearch?: (query: string) => void
  readonly className?: string
}

export function Search({ placeholder = "Suchen...", onSearch, className }: SearchProps): JSX.Element {
  const [query, setQuery] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  )
}

// Breadcrumbs Component
interface BreadcrumbItem {
  readonly label: string
  readonly href?: string
}

interface BreadcrumbsProps {
  readonly items: BreadcrumbItem[]
  readonly className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps): JSX.Element {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-6 h-6 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
