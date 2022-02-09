// @ts-ignore - I do not want an ES6 module here
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
  },
  settings: {},
  ignorePatterns: ["generated/*", "*.config*", "node_modules/*"],
};
