import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.ts",
      name: "interpreter",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@open-decision/type-classes", "react"],
    },
  },
});
