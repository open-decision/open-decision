const { createGlobPatternsForDependencies } = require("@nrwl/next/tailwind");

const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "./**/*.{js,ts,jsx,tsx}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("@open-decision/design-system/tailwind.config.js")],
};
