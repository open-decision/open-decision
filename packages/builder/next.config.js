const withTM = require("next-transpile-modules")([
  "@open-legal-tech/design-system",
]);

module.exports = withTM({
  target: "serverless",
});
