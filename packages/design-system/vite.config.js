import path from "path";
import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";
import pluginReact from "@vitejs/plugin-react";

module.exports = defineConfig({
  plugins: [pluginReact({ jsxRuntime: "classic" })],
  build: {
    outDir: "lib",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "design-system",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
  },
});
