module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/prisma-tests/singleton.ts"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
