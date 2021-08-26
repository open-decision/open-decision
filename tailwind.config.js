module.exports = {
  mode: "jit",
  presets: [require("@open-legal-tech/design-system/tailwind")],
  purge: ["./src/**/*.tsx", "./src/**/*.ts"],
};
