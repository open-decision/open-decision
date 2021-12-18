import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDef from "../../docs/swaggerDef";

const docsRouter = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition: swaggerDef,
  apis: ["src/docs/*.yml", "src/routes/v1/*.ts"],
});

docsRouter.use("/", swaggerUi.serve);
docsRouter.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default docsRouter;
