// const path = require("path");

const nextConfig = {
  i18n: {
    locales: ["de"],
    defaultLocale: "de",
  },
  reactStrictMode: true,
  // webpack(config, { dev, isServer }) {
  //   if (dev && !isServer) {
  //     const originalEntry = config.entry;
  //     config.entry = async () => {
  //       const wdrPath = path.resolve(__dirname, "./scripts/wdyr.js");
  //       const entries = await originalEntry();

  //       if (entries["main.js"] && !entries["main.js"].includes(wdrPath)) {
  //         entries["main.js"].push(wdrPath);
  //       }
  //       return entries;
  //     };
  //   }

  //   return config;
  // },
};

module.exports = nextConfig;
