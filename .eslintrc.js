// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
    project: "tsconfig.eslint.json",
  },
  plugins: ["react", "@typescript-eslint", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    {
      files: "test/**/*.ts",
      env: { node: true, jest: true },
    },
  ],
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  ignorePatterns: ["src/generated/*"],
};
