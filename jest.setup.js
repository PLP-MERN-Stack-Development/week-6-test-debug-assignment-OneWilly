import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock window.confirm for delete operations
global.confirm = jest.fn(() => true)

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: {
    reload: jest.fn(),
  },
  writable: true,
})
