import { PrismaClient } from "@prisma/client";
import { logger } from "./config/logger";
import * as s3Service from "./services/s3.service";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (
    (params.model == "PublishedTemplate" ||
      params.model == "DocumentTemplate") &&
    (params.action == "delete" || params.action == "deleteMany")
  ) {
    const result = await next(params);
    console.log(result);
    if (params.action == "deleteMany") {
      logger.error("Deleted from DB but not from S3", JSON.stringify(params));
      return result;
    }
    s3Service.deleteFile(result.s3BucketName, result.s3Key);
    return result;
  }
  return next(params);
});
export default prisma;
