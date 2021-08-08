const config = require("@open-legal-tech/design-system");

module.exports = {
  mode: "jit",
  presets: [config.tailwindConfig],
  purge: ["./src/**/*.tsx", "./src/**/*.ts"],
};
