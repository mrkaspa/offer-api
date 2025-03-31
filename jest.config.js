module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
}
