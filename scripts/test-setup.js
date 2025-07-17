// Test setup script for comprehensive testing

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🧪 Setting up comprehensive test environment...")

// Create test directories
const testDirs = ["__tests__/unit", "__tests__/integration", "__tests__/e2e", "coverage", "test-results"]

testDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }
})

// Generate test data
const testData = {
  sampleBugs: [
    {
      id: "test-1",
      title: "Sample Bug 1",
      description: "This is a sample bug for testing purposes",
      status: "open",
      priority: "high",
      createdAt: new Date().toISOString(),
    },
    {
      id: "test-2",
      title: "Sample Bug 2",
      description: "Another sample bug with different properties",
      status: "in-progress",
      priority: "medium",
      createdAt: new Date().toISOString(),
    },
  ],
  testScenarios: [
    {
      name: "Valid Bug Creation",
      input: {
        title: "Valid Test Bug",
        description: "This is a valid bug description for testing",
        priority: "medium",
      },
      expected: "success",
    },
    {
      name: "Invalid Bug Creation - Short Title",
      input: {
        title: "Bug",
        description: "Valid description",
        priority: "low",
      },
      expected: "validation_error",
    },
  ],
}

// Write test data file
fs.writeFileSync(path.join(__dirname, "../__tests__/test-data.json"), JSON.stringify(testData, null, 2))

console.log("✅ Test data generated")

// Run initial test to verify setup
try {
  console.log("🔍 Running initial test verification...")
  execSync("npm test -- --passWithNoTests", { stdio: "inherit" })
  console.log("✅ Test environment setup complete!")
} catch (error) {
  console.error("❌ Test setup failed:", error.message)
  process.exit(1)
}

console.log(`
🎉 Test Environment Ready!

Available Commands:
- npm test                 # Run all tests
- npm run test:watch       # Watch mode
- npm run test:coverage    # Coverage report
- npm run test:ci          # CI/CD mode

Test Structure:
- Unit Tests: __tests__/unit/
- Integration Tests: __tests__/integration/
- E2E Tests: __tests__/e2e/
- Test Data: __tests__/test-data.json
`)
