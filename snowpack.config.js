module.exports = {
  mount: { public: "/", src: "/_dist_" },
  plugins: [
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-react-refresh",
    [
      "@snowpack/plugin-run-script",
      { cmd: "eslint 'src/**/*.{js,jsx,ts,tsx}'", watch: 'watch "$1" src' },
    ],
    "@snowpack/plugin-webpack",
  ],
  install: [],
  installOptions: {},
  devOptions: { open: "none" },
  buildOptions: {},
  proxy: {},
  alias: { "@internalTypes": "./src/types" },
};
