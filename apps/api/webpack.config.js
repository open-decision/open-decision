const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (config, context) => {
  return merge(config, {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          "node_modules/swagger-ui-dist/swagger-ui.css",
          "node_modules/swagger-ui-dist/swagger-ui-bundle.js",
          "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js",
          "node_modules/swagger-ui-dist/favicon-16x16.png",
          "node_modules/swagger-ui-dist/favicon-32x32.png",
        ],
      }),
    ],
  });
};
