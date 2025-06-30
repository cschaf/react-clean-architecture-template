import '@testing-library/jest-dom'

// Globale Test-Utilities und Mocks
global.ResizeObserver = class ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    // Mock implementation
  }
  observe() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
}

// Mock für matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock für IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
  takeRecords() {
    return []
  }
} as any
