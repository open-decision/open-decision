module.exports = {
  testEnvironment: "node",
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  restoreMocks: true,
  moduleNameMapper: {
    "^@prisma-client": "<rootDir>/prisma/generated/prisma-client/index",
    "@type-graphql-prisma": "<rootDir>/prisma/generated/type-graphql/",
  },
  roots: ["<rootDir>"],
  // setupFilesAfterEnv: ["<rootDir>/tests/utils/singleton.ts"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/prisma/generated/prisma-client/"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "prisma/generated",
    "src/config",
    "dist",
    "src/app.js",
    "tests",
  ],
  coverageReporters: ["text", "lcov", "clover", "html"],
};
