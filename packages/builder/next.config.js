const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");

const withTM = require("next-transpile-modules")([
  "@open-legal-tech/design-system",
  "@open-decision/type-classes",
  "@open-decision/interpreter",
]);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([withSentryConfig, withTM, withBundleAnalyzer], {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/auth/:path",
        destination: "https://od-node-backend.herokuapp.com/v1/auth/:path",
      },
    ];
  },
});
