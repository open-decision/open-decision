const { tailwindConfig } = require("@open-legal-tech/design-system");

module.exports = {
  mode: "jit",
  presets: [tailwindConfig],
  purge: ["./src/**/*.tsx", "./src/**/*.ts"],
};
