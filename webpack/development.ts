/* eslint-disable */
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function buildDevelopementConfig(env: any, dirname: any) {
  console.log("Start build for NODE_ENV: ", env.NODE_ENV);

  return {
    entry: "./src/index.tsx",
    devtool: "inline-source-map",
    mode: "development",
    resolve: {
      extensions: [".js", ".json", ".ts", ".jsx", ".tsx"],
    },
    output: {
      path: dirname + "/dist",
      filename: "index.js",
      publicPath: "/",
    },
    devServer: {
      publicPath: "http://localhost:3000",
      port: 3000,
      contentBase: dirname + "/public",
      hotOnly: true,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: /(\/|\\)src/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                "react-refresh/babel",
                "emotion",
                "@babel/plugin-syntax-dynamic-import",
              ],
              presets: ["@babel/preset-react", "@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        eslint: {
          files: "./src/**/*",
        },
      }),
      new ReactRefreshWebpackPlugin(),
    ],
  };
}

module.exports = buildDevelopementConfig;
