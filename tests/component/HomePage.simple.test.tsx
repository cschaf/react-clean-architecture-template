import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '@/presentation/pages/HomePage'
import { DependencyProvider } from '@/app/providers/DependencyProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import type { Dependencies } from '@/app/providers/DependencyProvider'

// Test wrapper component
function TestWrapper({ children, dependencies }: { 
  children: React.ReactNode
  dependencies?: Partial<Dependencies>
}) {
  return (
    <BrowserRouter>
      <DependencyProvider overrides={dependencies}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </DependencyProvider>
    </BrowserRouter>
  )
}

// Helper function to render component with test setup
function renderHomePage(dependencies?: Partial<Dependencies>) {
  return render(
    <TestWrapper dependencies={dependencies}>
      <HomePage />
    </TestWrapper>
  )
}

describe('HomePage - Simplified Tests', () => {
  beforeEach(() => {
    // Clear any previous test state
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('basic rendering', () => {
    it('should render the welcome message', () => {
      renderHomePage()
      expect(screen.getByText(/willkommen bei/i)).toBeInTheDocument()
    })

    it('should render the main heading', () => {
      renderHomePage()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      renderHomePage()
      expect(screen.getByRole('link', { name: /mehr erfahren/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /dashboard erkunden/i })).toBeInTheDocument()
    })
  })

  describe('content sections', () => {
    it('should render features section', () => {
      renderHomePage()
      expect(screen.getByText(/funktionen & vorteile/i)).toBeInTheDocument()
    })

    it('should render technology stack section', () => {
      renderHomePage()
      expect(screen.getByText(/technologie-stack/i)).toBeInTheDocument()
    })

    it('should render getting started section', () => {
      renderHomePage()
      expect(screen.getByText(/schnellstart/i)).toBeInTheDocument()
    })

    it('should render call to action section', () => {
      renderHomePage()
      expect(screen.getByText(/bereit loszulegen/i)).toBeInTheDocument()
    })
  })

  describe('feature content', () => {
    it('should display core features', () => {
      renderHomePage()
      
      // Check for main feature categories
      expect(screen.getByText(/clean architecture/i)).toBeInTheDocument()
      expect(screen.getByText(/typescript/i)).toBeInTheDocument()
      expect(screen.getByText(/modern ui/i)).toBeInTheDocument()
      expect(screen.getByText(/testing ready/i)).toBeInTheDocument()
    })

    it('should display technology items', () => {
      renderHomePage()
      
      // Check for technology stack items
      expect(screen.getByText(/react 18/i)).toBeInTheDocument()
      expect(screen.getByText(/vite/i)).toBeInTheDocument()
      expect(screen.getByText(/tailwind/i)).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should have correct link URLs', () => {
      renderHomePage()

      const aboutLink = screen.getByRole('link', { name: /mehr erfahren/i })
      expect(aboutLink).toHaveAttribute('href', '/about')

      const dashboardLink = screen.getByRole('link', { name: /dashboard erkunden/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })
  })

  describe('accessibility basics', () => {
    it('should have proper heading structure', () => {
      renderHomePage()

      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })

      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('should have accessible links', () => {
      renderHomePage()

      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
      })
    })
  })
})
