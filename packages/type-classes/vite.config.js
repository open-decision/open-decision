import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "type-classes",
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
  },
});