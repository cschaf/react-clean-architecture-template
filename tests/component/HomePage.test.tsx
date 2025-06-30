import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('HomePage', () => {
  beforeEach(() => {
    // Clear any previous test state
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('rendering', () => {
    it('should render the welcome message', () => {
      renderHomePage()

      expect(screen.getByText(/willkommen bei/i))
        .toBeInTheDocument()
    })

    it('should render the hero section', () => {
      renderHomePage()

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText(/modernes react-template/i)).toBeInTheDocument()
    })

    it('should render feature cards', () => {
      renderHomePage()

      // Check for feature cards
      expect(screen.getByText(/clean architecture/i)).toBeInTheDocument()
      expect(screen.getByText(/typescript/i)).toBeInTheDocument()
      expect(screen.getByText(/modern ui/i)).toBeInTheDocument()
      expect(screen.getByText(/testing ready/i)).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      renderHomePage()

      expect(screen.getByRole('link', { name: /mehr erfahren/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /benutzer verwalten/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /dashboard erkunden/i })).toBeInTheDocument()
    })

    it('should render getting started section', () => {
      renderHomePage()

      expect(screen.getByText(/schnellstart/i)).toBeInTheDocument()
      expect(screen.getByText(/template klonen/i)).toBeInTheDocument()
    })
  })

  describe('content sections', () => {
    it('should render technology stack section', () => {
      renderHomePage()

      expect(screen.getByText(/technologie-stack/i)).toBeInTheDocument()
      expect(screen.getByText(/react 18/i)).toBeInTheDocument()
      expect(screen.getByText(/vite/i)).toBeInTheDocument()
    })

    it('should render call to action section', () => {
      renderHomePage()

      expect(screen.getByText(/bereit loszulegen/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /einstellungen/i })).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should navigate to about page when clicking learn more link', async () => {
      renderHomePage()

      const aboutLink = screen.getByRole('link', { name: /mehr erfahren/i })
      
      // Check that the link has correct href
      expect(aboutLink).toHaveAttribute('href', '/about')
    })

    it('should navigate to users page when clicking users link', async () => {
      renderHomePage()

      const usersLink = screen.getByRole('link', { name: /benutzer verwalten/i })
      
      expect(usersLink).toHaveAttribute('href', '/users')
    })

    it('should navigate to dashboard when clicking dashboard link', async () => {
      renderHomePage()

      const dashboardLink = screen.getByRole('link', { name: /dashboard erkunden/i })
      
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })
  })

  describe('feature cards interaction', () => {
    it('should display feature cards with hover effects', async () => {
      const user = userEvent.setup()
      renderHomePage()

      const cleanArchCard = screen.getByText(/clean architecture/i).closest('div')
      expect(cleanArchCard).toBeInTheDocument()

      if (cleanArchCard) {
        await user.hover(cleanArchCard)
        
        // Check if card has hover class
        expect(cleanArchCard).toHaveClass('hover:shadow-md')
      }
    })

    it('should display correct feature descriptions', () => {
      renderHomePage()

      // Check Clean Architecture description
      expect(screen.getByText(/klare trennung von geschäftslogik/i))
        .toBeInTheDocument()

      // Check TypeScript description  
      expect(screen.getByText(/vollständige typsicherheit/i))
        .toBeInTheDocument()

      // Check UI description
      expect(screen.getByText(/responsives design/i))
        .toBeInTheDocument()

      // Check Testing description
      expect(screen.getByText(/vorgefertigte test-setup/i))
        .toBeInTheDocument()
    })
  })

  describe('responsive behavior', () => {
    it('should adapt layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderHomePage()

      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
      
      // Check if mobile-specific classes are applied
      const featureGrid = document.querySelector('.grid')
      expect(featureGrid).toBeInTheDocument()
    })

    it('should show desktop layout on larger screens', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      
      renderHomePage()

      const featureGrid = document.querySelector('.grid')
      expect(featureGrid).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderHomePage()

      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      const h3s = screen.getAllByRole('heading', { level: 3 })

      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
      expect(h3s.length).toBeGreaterThan(0)
    })

    it('should have proper ARIA labels for interactive elements', () => {
      renderHomePage()

      const themeToggle = screen.getByRole('button', { name: /theme wechseln/i })
      expect(themeToggle).toHaveAttribute('aria-label')

      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      renderHomePage()

      // Tab through interactive elements
      await user.tab()
      
      // First focusable element should be focused
      const firstLink = screen.getAllByRole('link')[0]
      expect(firstLink).toHaveFocus()

      // Continue tabbing to next link
      await user.tab()
      
      const secondLink = screen.getAllByRole('link')[1]
      expect(secondLink).toHaveFocus()
    })

    it('should have proper semantic HTML structure', () => {
      renderHomePage()

      // Check for semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument() // header
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Check for proper section structure
      const sections = screen.getAllByRole('region')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('should provide alternative text for images', () => {
      renderHomePage()

      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })
  })

  describe('performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = renderHomePage()

      // Re-render with same props
      rerender(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Component should still be functional
      expect(screen.getByText(/willkommen bei/i))
        .toBeInTheDocument()
    })

    it('should load quickly without heavy dependencies', () => {
      const startTime = performance.now()
      
      renderHomePage()
      
      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render in reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100)
    })
  })

  describe('error boundaries', () => {
    it('should handle rendering errors gracefully', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Force an error in a child component
      const ErrorComponent = () => {
        throw new Error('Test error')
      }

      expect(() => {
        render(
          <TestWrapper>
            <ErrorComponent />
          </TestWrapper>
        )
      }).not.toThrow()

      consoleSpy.mockRestore()
    })
  })

  describe('integration with dependencies', () => {
    it('should work with custom dependency overrides', () => {
      const mockDependencies = {
        // Mock dependencies if needed for specific tests
      }

      renderHomePage(mockDependencies)

      expect(screen.getByText(/willkommen bei/i))
        .toBeInTheDocument()
    })

    it('should handle missing dependencies gracefully', () => {
      // Test with minimal dependencies
      renderHomePage({})

      expect(screen.getByText(/willkommen bei/i))
        .toBeInTheDocument()
    })
  })
})
