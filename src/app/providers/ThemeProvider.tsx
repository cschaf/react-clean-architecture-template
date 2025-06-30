/**
 * Theme Provider - Application Layer
 * Diese Komponente stellt Theme-Funktionalität für die Anwendung bereit
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { THEMES } from '@/shared/constants'
import { useStorageService } from './DependencyProvider'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  readonly theme: Theme
  readonly effectiveTheme: 'light' | 'dark'
  readonly setTheme: (theme: Theme) => void
  readonly toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme muss innerhalb von ThemeProvider verwendet werden')
  }
  return context
}

interface ThemeProviderProps {
  readonly children: React.ReactNode
  readonly defaultTheme?: Theme
  readonly storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = THEMES.SYSTEM as Theme,
  storageKey = 'theme'
}: ThemeProviderProps): JSX.Element {
  const storageService = useStorageService()
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (storageService.getTheme() as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Effektives Theme basierend auf aktueller Auswahl
  const effectiveTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme

  // Überwache System-Theme-Änderungen
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Aktualisiere DOM-Klassen wenn sich das effektive Theme ändert
  useEffect(() => {
    const root = window.document.documentElement
    
    // Entferne alle Theme-Klassen
    root.classList.remove('light', 'dark')
    
    // Füge aktuelle Theme-Klasse hinzu
    root.classList.add(effectiveTheme)
    
    // Setze data-theme Attribut für CSS-Variablen
    root.setAttribute('data-theme', effectiveTheme)
    
    // Aktualisiere Meta-Theme-Color für mobile Browser
    updateMetaThemeColor(effectiveTheme)
  }, [effectiveTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      storageService.setTheme(newTheme)
    } catch (error) {
      console.error('Fehler beim Speichern des Themes:', error)
    }
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const value: ThemeContextValue = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hilfsfunktion für Meta-Theme-Color
function updateMetaThemeColor(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (!themeColorMeta) return

  const colors = {
    light: '#ffffff',
    dark: '#0f0f0f',
  }

  themeColorMeta.setAttribute('content', colors[theme])
}

// Theme-Utility-Hook für Theme-bewusste Komponenten
export function useThemeAwareValue<T>(lightValue: T, darkValue: T): T {
  const { effectiveTheme } = useTheme()
  return effectiveTheme === 'dark' ? darkValue : lightValue
}

// CSS-Klassen-Hook für Theme-abhängige Styles
export function useThemeClasses(lightClasses: string, darkClasses: string): string {
  const { effectiveTheme } = useTheme()
  return effectiveTheme === 'dark' ? darkClasses : lightClasses
}

// Theme-Detection-Hook für SSR
export function useIsomorphicTheme() {
  const [mounted, setMounted] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Während SSR/Hydratation verwende das System-Theme als Fallback
  if (!mounted) {
    return {
      ...theme,
      effectiveTheme: 'light' as const,
    }
  }

  return theme
}

// Theme-Persistence-Hook für komplexere Storage-Szenarien
export function useThemePersistence() {
  const { theme, setTheme } = useTheme()
  const storageService = useStorageService()

  const saveTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    // Zusätzliche Persistence-Logik hier
  }

  const loadTheme = (): Theme => {
    try {
      return (storageService.getTheme() as Theme) || THEMES.SYSTEM as Theme
    } catch {
      return THEMES.SYSTEM as Theme
    }
  }

  const resetTheme = () => {
    setTheme(THEMES.SYSTEM as Theme)
    storageService.setTheme(THEMES.SYSTEM)
  }

  return {
    theme,
    saveTheme,
    loadTheme,
    resetTheme,
  }
}

// Theme-Transition-Hook für smooth Theme-Wechsel
export function useThemeTransition() {
  const { setTheme } = useTheme()

  const setThemeWithTransition = (newTheme: Theme) => {
    // Füge CSS-Klasse für Transition hinzu
    document.documentElement.classList.add('theme-transition')
    
    setTheme(newTheme)
    
    // Entferne Transition-Klasse nach Abschluss
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
  }

  return { setThemeWithTransition }
}
