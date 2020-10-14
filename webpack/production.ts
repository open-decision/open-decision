/* eslint-disable */
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

export function buildProductionConfig(env, dirname) {
  console.log("Start build for NODE_ENV: ", env.NODE_ENV);

  return {
    entry: dirname + "/src/index.tsx",
    output: {
      path: dirname + "/dist",
      filename: "index.js",
      publicPath: "/",
    },
    mode: "production",
    resolve: {
      extensions: [".js", ".json", ".ts", ".jsx", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: dirname + "/src",
          use: {
            loader: "babel-loader",
            options: {
              plugins: ["emotion", "@babel/plugin-syntax-dynamic-import"],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    modules: false,
                    targets: { browsers: ["last 2 versions"] },
                  },
                ],
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
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
      new CleanWebpackPlugin(),
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        cache: true,
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: "sourcemaps/[name].js.map",
        lineToLine: true,
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
      }),
    ],
    performance: {
      hints: "warning",
    },
  };
}

module.exports = buildProductionConfig;
