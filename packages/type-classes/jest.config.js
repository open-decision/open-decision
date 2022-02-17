module.exports = {
  // testEnvironment: "node",
  restoreMocks: true,
  preset: "ts-jest",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  coveragePathIgnorePatterns: ["node_modules", "tests"],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
