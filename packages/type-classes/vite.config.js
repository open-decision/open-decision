import { defineConfig } from "vite";

export default defineConfig(
  /**
   * @type {import('vite').UserConfig}
   */
  {
    build: {
      outDir: "lib",
      lib: {
        entry: "./src/index.ts",
        name: "type-classes",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
  }
);
