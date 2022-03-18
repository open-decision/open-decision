import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [pluginReact({ jsxRuntime: "classic" })],
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.ts",
      name: "design-system",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@fontsource/poppins", "react", "react-dom"],
    },
  },
});
