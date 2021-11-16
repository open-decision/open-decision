const withPlugins = require("next-compose-plugins");

const withTM = require("next-transpile-modules")([
  "@open-legal-tech/design-system",
  "@open-decision/type-classes",
  "@open-decision/interpreter",
]);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([withTM, withBundleAnalyzer], {
  target: "serverless",
});
