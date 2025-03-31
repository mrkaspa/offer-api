import { config } from "dotenv"

// Load environment variables from .env file
config()

// Add any global test setup here
beforeAll(() => {
  // Global setup code
  jest.setTimeout(10000) // Increase timeout for tests
})

afterAll(() => {
  // Global cleanup code
  jest.clearAllMocks()
})

// Add global error handler
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error)
})
