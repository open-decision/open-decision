module.exports = {
  testEnvironment: "node",
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  restoreMocks: true,
  preset: "ts-jest",
  roots: ["<rootDir>"],
  // setupFilesAfterEnv: ["<rootDir>/tests/utils/singleton.ts"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/config",
    "dist",
    "src/app.js",
    "tests",
  ],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
