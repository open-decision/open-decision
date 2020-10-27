module.exports = {
  mount: { public: "/", src: "/_dist_" },
  plugins: [
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-webpack",
    "@snowpack/plugin-postcss",
    // "@snowpack/plugin-sass",
  ],
  install: [],
  installOptions: {},
  devOptions: { open: "none", port: 3000 },
  buildOptions: {},
  proxy: {},
  alias: {
    "@internalTypes": "./src/types",
    "@components": "./src/components",
    "@features": "./src/features",
  },
};
