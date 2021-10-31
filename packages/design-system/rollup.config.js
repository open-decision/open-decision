import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import glob from "glob";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: glob.sync("src/**/*.ts?(x)", {
    ignore: ["src/internal/**"],
  }),
  output: [
    {
      dir: "lib",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
    },
    {
      dir: "lib",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].mjs",
    },
  ],
  plugins: [commonjs(), resolve(), peerDepsExternal(), typescript()],
};

export default options;
