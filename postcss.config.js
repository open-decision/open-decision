const purgecss = require("@fullhuman/postcss-purgecss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    process.env.NODE_ENV === "production" &&
      // @ts-ignore
      purgecss({
        content: ["./src/**/*.tsx", "./src/**/*.jsx", "./public/index.html"],
        defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      }),
  ],
};
