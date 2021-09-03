module.exports = {
  mode: "jit",
  presets: [require("@open-legal-tech/tailwind")],
  purge: ["./src/**/*.tsx", "./src/**/*.ts"],
};
