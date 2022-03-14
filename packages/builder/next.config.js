const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins(
  [withSentryConfig({}, { silent: true }), withBundleAnalyzer],
  {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/auth/:path",
          destination: `${process.env.OD_API_ENDPOINT}/v1/auth/:path`,
        },
        {
          source: "/graphql",
          destination: `${process.env.OD_API_ENDPOINT}/v1/graphql`,
        },
      ];
    },
  }
);
