// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier", "plugin:@typescript-eslint/recommended"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};
