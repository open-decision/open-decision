/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
      components: path.resolve(__dirname, "src/components"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000",
    hotOnly: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new HtmlWebpackPlugin({
    template: "./public/index.html",
    filename: "./index.html"
  })],
};
