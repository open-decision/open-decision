import config from "../config/config";

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "Open Decision Backend Documentation",
    description:
      "Open API definition for the Open Decision backend. Refer to [github.com/open-legal-tech](https://github.com/open-legal-tech) for more information. Download the API definition as JSON [here](export).",
    version: process.env.npm_package_version!,
    license: {
      name: "MIT",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/v1`,
      description: "Development server",
    },
    {
      url: "https://api.open-decision.org/v1",
      description: "Production server",
    },
  ],
};

export default swaggerDef;
