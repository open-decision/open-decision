import { z } from "zod";
import { FileType } from "@prisma/client";

export const DocumentTemplateModel = z.object({
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  displayName: z.string(),
  fileType: z.nativeEnum(FileType),
  ownerUuid: z.string().uuid(),
  s3BucketName: z.string(),
  s3Key: z.string(),
  fullS3Path: z.string().optional(),
  treeUuid: z.string().uuid(),
});
