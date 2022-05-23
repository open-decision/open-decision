const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");
const withNx = require("@nrwl/next/plugins/with-nx");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: true,
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  async rewrites() {
    return [
      {
        source: "/external-api/auth/:path",
        destination: `${process.env.OD_API_ENDPOINT}/v1/auth/:path`,
      },
      {
        source: "/external-api/graphql",
        destination: `${process.env.OD_API_ENDPOINT}/v1/graphql`,
      },
      {
        source: "/external-api/users/:uuid",
        destination: `${process.env.OD_API_ENDPOINT}/v1/users/:uuid`,
      },
      {
        source: "/external-api/users/is-whitelisted",
        destination: `${process.env.OD_API_ENDPOINT}/v1/users/is-whitelisted`,
      },
    ];
  },
};

module.exports = withPlugins(
  [withSentryConfig({}, { silent: true }), withBundleAnalyzer, withNx],
  nextConfig
);
