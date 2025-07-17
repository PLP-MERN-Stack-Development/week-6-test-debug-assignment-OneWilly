import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugForm } from "@/components/BugForm"
import { BugProvider } from "@/contexts/BugContext"
import jest from "jest"

// Mock the context for testing
const MockBugProvider = ({ children }: { children: React.ReactNode }) => {
  const mockContext = {
    bugs: [],
    loading: false,
    error: null,
    createBug: jest.fn(),
    updateBug: jest.fn(),
    deleteBug: jest.fn(),
    debugLogs: [],
    addDebugLog: jest.fn(),
  }

  return <BugProvider>{children}</BugProvider>
}

describe("BugForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders form fields correctly", () => {
    render(
      <MockBugProvider>
        <BugForm />
      </MockBugProvider>,
    )

    expect(screen.getByLabelText(/bug title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /report bug/i })).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    render(
      <MockBugProvider>
        <BugForm />
      </MockBugProvider>,
    )

    const submitButton = screen.getByRole("button", { name: /report bug/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
  })

  it("validates minimum field lengths", async () => {
    render(
      <MockBugProvider>
        <BugForm />
      </MockBugProvider>,
    )

    const titleInput = screen.getByLabelText(/bug title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole("button", { name: /report bug/i })

    fireEvent.change(titleInput, { target: { value: "Bug" } }) // Too short
    fireEvent.change(descriptionInput, { target: { value: "Short" } }) // Too short
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 5 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    render(
      <MockBugProvider>
        <BugForm />
      </MockBugProvider>,
    )

    const titleInput = screen.getByLabelText(/bug title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole("button", { name: /report bug/i })

    fireEvent.change(titleInput, { target: { value: "Valid Bug Title" } })
    fireEvent.change(descriptionInput, { target: { value: "This is a valid bug description that is long enough" } })
    fireEvent.click(submitButton)

    // Form should clear after successful submission
    await waitFor(() => {
      expect(titleInput).toHaveValue("")
      expect(descriptionInput).toHaveValue("")
    })
  })
})
