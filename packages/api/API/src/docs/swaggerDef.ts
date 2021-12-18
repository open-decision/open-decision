import config from "../config/config";

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "Open Decision Backend Documentation",
    version: process.env.npm_package_version!,
    license: {
      name: "MIT",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/v1`,
    },
  ],
};

export default swaggerDef;
