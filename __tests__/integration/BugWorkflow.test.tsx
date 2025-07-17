import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BugProvider } from "@/contexts/BugContext"
import { BugForm } from "@/components/BugForm"
import { BugList } from "@/components/BugList"

// Integration test for complete bug workflow
describe("Bug Workflow Integration", () => {
  const TestApp = () => (
    <BugProvider>
      <div>
        <BugForm />
        <BugList filter="all" />
      </div>
    </BugProvider>
  )

  it("should create, display, and update a bug", async () => {
    render(<TestApp />)

    // Step 1: Create a new bug
    const titleInput = screen.getByLabelText(/bug title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole("button", { name: /report bug/i })

    fireEvent.change(titleInput, { target: { value: "Integration Test Bug" } })
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test bug for integration testing" },
    })
    fireEvent.click(submitButton)

    // Step 2: Verify bug appears in list
    await waitFor(() => {
      expect(screen.getByText("Integration Test Bug")).toBeInTheDocument()
      expect(screen.getByText("This is a test bug for integration testing")).toBeInTheDocument()
    })

    // Step 3: Update bug status
    const statusSelect = screen.getByDisplayValue("open")
    fireEvent.click(statusSelect)

    const resolvedOption = screen.getByText("Resolved")
    fireEvent.click(resolvedOption)

    // Step 4: Verify status update
    await waitFor(() => {
      expect(screen.getByText("Resolved")).toBeInTheDocument()
    })
  })

  it("should handle form validation errors", async () => {
    render(<TestApp />)

    // Try to submit empty form
    const submitButton = screen.getByRole("button", { name: /report bug/i })
    fireEvent.click(submitButton)

    // Verify validation errors appear
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })

    // Verify bug was not created
    expect(screen.queryByText("Integration Test Bug")).not.toBeInTheDocument()
  })

  it("should filter bugs by status", async () => {
    render(
      <BugProvider>
        <div>
          <BugForm />
          <div data-testid="open-bugs">
            <BugList filter="open" />
          </div>
          <div data-testid="resolved-bugs">
            <BugList filter="resolved" />
          </div>
        </div>
      </BugProvider>,
    )

    // Create a bug
    const titleInput = screen.getByLabelText(/bug title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole("button", { name: /report bug/i })

    fireEvent.change(titleInput, { target: { value: "Filter Test Bug" } })
    fireEvent.change(descriptionInput, {
      target: { value: "This bug will be used to test filtering" },
    })
    fireEvent.click(submitButton)

    // Verify bug appears in open filter
    await waitFor(() => {
      const openBugsSection = screen.getByTestId("open-bugs")
      expect(openBugsSection).toHaveTextContent("Filter Test Bug")
    })

    // Verify bug doesn't appear in resolved filter
    const resolvedBugsSection = screen.getByTestId("resolved-bugs")
    expect(resolvedBugsSection).not.toHaveTextContent("Filter Test Bug")
  })
})
