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

module.exports = withPlugins(
  [withSentryConfig({}, { silent: true }), withTM, withBundleAnalyzer],
  {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/auth/:path",
          destination: "http://api.open-decision.org/v1/auth/:path",
        },
        {
          source: "/graphql",
          destination: "http://api.open-decision.org/v1/graphql",
        },
      ];
    },
  }
);
