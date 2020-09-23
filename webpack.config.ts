/* eslint-disable */
const path = require("path");
const developmentConfig = require("./webpack/development");
const productionConfig = require("./webpack/production");

module.exports = (env) => {
  if (env.NODE_ENV === "production")
    return productionConfig(env, path.resolve(__dirname));

  if (env.NODE_ENV === "development")
    return developmentConfig(env, path.resolve(__dirname));
};
