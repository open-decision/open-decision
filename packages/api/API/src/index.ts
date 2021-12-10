import "reflect-metadata";
import prisma from "./init-prisma-client";
import { buildSchema } from "type-graphql";

import { app } from "./app";
import config from "./config/config";
import { logger } from "./config/logger";
import { TreeResolver } from "./graphql/resolvers";
import { cleanBlocklist } from "./auth.old/utils/access-token-blocklist";

const port = config.PORT || 4000;

let schema: any;

async function asyncPreparation() {
  schema = await buildSchema({
    resolvers: [TreeResolver],
    emitSchemaFile: true,
  });

  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (e) {
    logger.info("Connection to database failed.");
  }
  cleanBlocklist();
}

export const server = app.listen({ port: config.PORT }, () => {
  logger.info(`Listening to port ${config.PORT}`);
});

asyncPreparation();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
