import type React from "react"
import { renderHook, act } from "@testing-library/react"
import { BugProvider, useBugContext } from "@/contexts/BugContext"

const wrapper = ({ children }: { children: React.ReactNode }) => <BugProvider>{children}</BugProvider>

describe("BugContext", () => {
  it("initializes with sample data", () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    expect(result.current.bugs).toHaveLength(3)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("creates a new bug", async () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    const newBug = {
      title: "Test Bug",
      description: "This is a test bug description",
      status: "open" as const,
      priority: "medium" as const,
    }

    await act(async () => {
      await result.current.createBug(newBug)
    })

    expect(result.current.bugs).toHaveLength(4)
    expect(result.current.bugs[0].title).toBe("Test Bug")
  })

  it("validates bug creation", async () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    const invalidBug = {
      title: "Bug", // Too short
      description: "This is a test bug description",
      status: "open" as const,
      priority: "medium" as const,
    }

    await act(async () => {
      try {
        await result.current.createBug(invalidBug)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain("Title must be at least 5 characters")
      }
    })
  })

  it("updates bug status", async () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    const bugId = result.current.bugs[0].id

    await act(async () => {
      await result.current.updateBug(bugId, { status: "resolved" })
    })

    const updatedBug = result.current.bugs.find((bug) => bug.id === bugId)
    expect(updatedBug?.status).toBe("resolved")
  })

  it("deletes a bug", async () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    const initialCount = result.current.bugs.length
    const bugId = result.current.bugs[0].id

    await act(async () => {
      await result.current.deleteBug(bugId)
    })

    expect(result.current.bugs).toHaveLength(initialCount - 1)
    expect(result.current.bugs.find((bug) => bug.id === bugId)).toBeUndefined()
  })

  it("logs debug messages", () => {
    const { result } = renderHook(() => useBugContext(), { wrapper })

    act(() => {
      result.current.addDebugLog("Test debug message")
    })

    expect(result.current.debugLogs).toContain(expect.stringContaining("Test debug message"))
  })
})
