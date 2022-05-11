import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    pluginReact({ jsxRuntime: "classic" }),
    dts(),
    // visualizer({ open: true }),
  ],
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.ts",
      name: "design-system",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@fontsource/poppins", "react", "react-dom", "uuid"],
    },
  },
});
