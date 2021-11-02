import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "./index.ts"),
      name: "interpreter",
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
  },
});
