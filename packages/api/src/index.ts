import "reflect-metadata";
import prisma from "./init-prisma-client";
import { app } from "./app";
import config from "./config/config";
import { logger } from "./config/logger";

async function asyncPreparation() {
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (e) {
    logger.error("Connection to database failed.");
  }
  // cleanBlocklist();
}

asyncPreparation();

export const server = app.listen({ port: config.PORT }, () => {
  logger.info(`Listening to port ${config.PORT}`);
});

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
