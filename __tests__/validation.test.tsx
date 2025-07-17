import {
  validateBugTitle,
  validateBugDescription,
  validateBugPriority,
  validateBugStatus,
  validateBug,
  sanitizeBugInput,
  MockBugDatabase,
} from "@/utils/validation"

describe("Bug Validation Functions", () => {
  describe("validateBugTitle", () => {
    it("should return error for empty title", () => {
      const result = validateBugTitle("")
      expect(result).toEqual({
        field: "title",
        message: "Title is required",
      })
    })

    it("should return error for title too short", () => {
      const result = validateBugTitle("Bug")
      expect(result).toEqual({
        field: "title",
        message: "Title must be at least 5 characters long",
      })
    })

    it("should return error for title too long", () => {
      const longTitle = "a".repeat(101)
      const result = validateBugTitle(longTitle)
      expect(result).toEqual({
        field: "title",
        message: "Title must be less than 100 characters",
      })
    })

    it("should return null for valid title", () => {
      const result = validateBugTitle("Valid Bug Title")
      expect(result).toBeNull()
    })
  })

  describe("validateBugDescription", () => {
    it("should return error for empty description", () => {
      const result = validateBugDescription("")
      expect(result).toEqual({
        field: "description",
        message: "Description is required",
      })
    })

    it("should return error for description too short", () => {
      const result = validateBugDescription("Short")
      expect(result).toEqual({
        field: "description",
        message: "Description must be at least 10 characters long",
      })
    })

    it("should return null for valid description", () => {
      const result = validateBugDescription("This is a valid bug description")
      expect(result).toBeNull()
    })
  })

  describe("validateBugPriority", () => {
    it("should return error for invalid priority", () => {
      const result = validateBugPriority("urgent")
      expect(result).toEqual({
        field: "priority",
        message: "Priority must be low, medium, or high",
      })
    })

    it("should return null for valid priority", () => {
      expect(validateBugPriority("low")).toBeNull()
      expect(validateBugPriority("medium")).toBeNull()
      expect(validateBugPriority("high")).toBeNull()
    })
  })

  describe("validateBugStatus", () => {
    it("should return error for invalid status", () => {
      const result = validateBugStatus("closed")
      expect(result).toEqual({
        field: "status",
        message: "Status must be open, in-progress, or resolved",
      })
    })

    it("should return null for valid status", () => {
      expect(validateBugStatus("open")).toBeNull()
      expect(validateBugStatus("in-progress")).toBeNull()
      expect(validateBugStatus("resolved")).toBeNull()
    })
  })

  describe("validateBug", () => {
    it("should return multiple errors for invalid bug", () => {
      const invalidBug = {
        title: "Bug", // Too short
        description: "Short", // Too short
        priority: "urgent", // Invalid
        status: "closed", // Invalid
      }

      const errors = validateBug(invalidBug)
      expect(errors).toHaveLength(4)
      expect(errors.map((e) => e.field)).toEqual(["title", "description", "priority", "status"])
    })

    it("should return empty array for valid bug", () => {
      const validBug = {
        title: "Valid Bug Title",
        description: "This is a valid bug description that is long enough",
        priority: "medium",
        status: "open",
      }

      const errors = validateBug(validBug)
      expect(errors).toHaveLength(0)
    })
  })

  describe("sanitizeBugInput", () => {
    it("should remove HTML tags and trim whitespace", () => {
      const input = '  <script>alert("xss")</script>Bug Title  '
      const result = sanitizeBugInput(input)
      expect(result).toBe('scriptalert("xss")/scriptBug Title')
    })

    it("should handle empty input", () => {
      const result = sanitizeBugInput("   ")
      expect(result).toBe("")
    })
  })
})

describe("MockBugDatabase", () => {
  let db: MockBugDatabase

  beforeEach(() => {
    db = new MockBugDatabase()
  })

  describe("create", () => {
    it("should create a new bug with ID and timestamps", async () => {
      const bugData = {
        title: "Test Bug",
        description: "Test Description",
        priority: "medium",
        status: "open",
      }

      const result = await db.create(bugData)

      expect(result).toMatchObject({
        id: 1,
        title: "Test Bug",
        description: "Test Description",
        priority: "medium",
        status: "open",
      })
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it("should increment ID for multiple bugs", async () => {
      const bug1 = await db.create({ title: "Bug 1", description: "Description 1" })
      const bug2 = await db.create({ title: "Bug 2", description: "Description 2" })

      expect(bug1.id).toBe(1)
      expect(bug2.id).toBe(2)
    })
  })

  describe("findAll", () => {
    it("should return empty array when no bugs exist", async () => {
      const result = await db.findAll()
      expect(result).toEqual([])
    })

    it("should return all bugs", async () => {
      await db.create({ title: "Bug 1", description: "Description 1" })
      await db.create({ title: "Bug 2", description: "Description 2" })

      const result = await db.findAll()
      expect(result).toHaveLength(2)
    })
  })

  describe("findById", () => {
    it("should return null for non-existent bug", async () => {
      const result = await db.findById(999)
      expect(result).toBeNull()
    })

    it("should return bug by ID", async () => {
      const created = await db.create({ title: "Test Bug", description: "Test Description" })
      const found = await db.findById(created.id)

      expect(found).toEqual(created)
    })
  })

  describe("update", () => {
    it("should return null for non-existent bug", async () => {
      const result = await db.update(999, { status: "resolved" })
      expect(result).toBeNull()
    })

    it("should update existing bug", async () => {
      const created = await db.create({ title: "Test Bug", description: "Test Description", status: "open" })
      const updated = await db.update(created.id, { status: "resolved" })

      expect(updated?.status).toBe("resolved")
      expect(updated?.updatedAt).not.toEqual(created.updatedAt)
    })
  })

  describe("delete", () => {
    it("should return false for non-existent bug", async () => {
      const result = await db.delete(999)
      expect(result).toBe(false)
    })

    it("should delete existing bug", async () => {
      const created = await db.create({ title: "Test Bug", description: "Test Description" })
      const deleted = await db.delete(created.id)

      expect(deleted).toBe(true)
      expect(db.count()).toBe(0)
    })
  })

  describe("helper methods", () => {
    it("should clear all bugs", async () => {
      await db.create({ title: "Bug 1", description: "Description 1" })
      await db.create({ title: "Bug 2", description: "Description 2" })

      expect(db.count()).toBe(2)

      db.clear()

      expect(db.count()).toBe(0)
    })
  })
})
