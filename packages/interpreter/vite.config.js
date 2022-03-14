import path from "path";
import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";

module.exports = defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "interpreter",
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
  },
});
