const { withSentryConfig } = require("@sentry/nextjs");
const withNx = require("@nrwl/next/plugins/with-nx");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  i18n: {
    locales: ["de"],
    defaultLocale: "de",
  },
  reactStrictMode: true,
  nx: {
    svgr: false,
  },
};

module.exports = withSentryConfig(withBundleAnalyzer(withNx(nextConfig)), {
  silent: true,
  org: "open-legal-tech-ev",
  project: "builder",
  url: "https://sentry.io/",
});
