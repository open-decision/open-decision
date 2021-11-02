const withTM = require("next-transpile-modules")([
  "@open-legal-tech/design-system",
  "@open-decision/type-classes",
]);

module.exports = withTM({
  target: "serverless",
});
