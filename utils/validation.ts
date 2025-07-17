// Backend-style validation functions for testing

export interface BugValidationError {
  field: string
  message: string
}

export function validateBugTitle(title: string): BugValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: "title", message: "Title is required" }
  }

  if (title.trim().length < 5) {
    return { field: "title", message: "Title must be at least 5 characters long" }
  }

  if (title.trim().length > 100) {
    return { field: "title", message: "Title must be less than 100 characters" }
  }

  return null
}

export function validateBugDescription(description: string): BugValidationError | null {
  if (!description || description.trim().length === 0) {
    return { field: "description", message: "Description is required" }
  }

  if (description.trim().length < 10) {
    return { field: "description", message: "Description must be at least 10 characters long" }
  }

  if (description.trim().length > 1000) {
    return { field: "description", message: "Description must be less than 1000 characters" }
  }

  return null
}

export function validateBugPriority(priority: string): BugValidationError | null {
  const validPriorities = ["low", "medium", "high"]

  if (!validPriorities.includes(priority)) {
    return { field: "priority", message: "Priority must be low, medium, or high" }
  }

  return null
}

export function validateBugStatus(status: string): BugValidationError | null {
  const validStatuses = ["open", "in-progress", "resolved"]

  if (!validStatuses.includes(status)) {
    return { field: "status", message: "Status must be open, in-progress, or resolved" }
  }

  return null
}

// Comprehensive bug validation
export function validateBug(bugData: {
  title: string
  description: string
  priority: string
  status: string
}): BugValidationError[] {
  const errors: BugValidationError[] = []

  const titleError = validateBugTitle(bugData.title)
  if (titleError) errors.push(titleError)

  const descriptionError = validateBugDescription(bugData.description)
  if (descriptionError) errors.push(descriptionError)

  const priorityError = validateBugPriority(bugData.priority)
  if (priorityError) errors.push(priorityError)

  const statusError = validateBugStatus(bugData.status)
  if (statusError) errors.push(statusError)

  return errors
}

// Helper function for sanitizing input
export function sanitizeBugInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// Mock database operations for testing
export class MockBugDatabase {
  private bugs: any[] = []
  private nextId = 1

  async create(bugData: any) {
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const bug = {
      id: this.nextId++,
      ...bugData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.bugs.push(bug)
    return bug
  }

  async findAll() {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return [...this.bugs]
  }

  async findById(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return this.bugs.find((bug) => bug.id === id) || null
  }

  async update(id: number, updates: any) {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const bugIndex = this.bugs.findIndex((bug) => bug.id === id)
    if (bugIndex === -1) return null

    this.bugs[bugIndex] = {
      ...this.bugs[bugIndex],
      ...updates,
      updatedAt: new Date(),
    }

    return this.bugs[bugIndex]
  }

  async delete(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const bugIndex = this.bugs.findIndex((bug) => bug.id === id)
    if (bugIndex === -1) return false

    this.bugs.splice(bugIndex, 1)
    return true
  }

  // Test helper methods
  clear() {
    this.bugs = []
    this.nextId = 1
  }

  count() {
    return this.bugs.length
  }
}
