import '@testing-library/jest-dom'

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// Mock performance API
global.performance = {
  now: () => Date.now(),
  getEntriesByType: () => [],
  getEntriesByName: () => [],
  mark: () => {},
  measure: () => {},
  clearMarks: () => {},
  clearMeasures: () => {},
  timeOrigin: Date.now()
} as unknown as Performance
