import prisma from "../init-prisma-client";
import { PrismaPromise } from "@prisma/client";
import { PublishedTemplate } from "@prisma/client";
import { newDocumentTemplateInterface } from "../services/documentTemplate.service";

export const createManyPublishedTemplates = async (
  originalTemplates: newDocumentTemplateInterface[],
  publishedTreeUuid: string
) => {
  const queries: PrismaPromise<PublishedTemplate>[] = [];

  originalTemplates.forEach((template) => {
    queries.push(
      prisma.publishedTemplate.create({
        data: {
          displayName: template.displayName,
          fileType: template.fileType,
          uuid: template.publishedData.uuid,
          s3BucketName: template.publishedData.s3BucketName,
          s3Key: template.publishedData.s3Key,
          originalTemplate: { connect: { uuid: template.uuid } },
          owner: { connect: { uuid: template.ownerUuid } },
          publishedTree: { connect: { uuid: publishedTreeUuid } },
        },
      })
    );
  });

  return prisma.$transaction(queries);
};

export const getSinglePublishedTemplate = async (templateUuid: string) => {
  return prisma.publishedTemplate.findUnique({
    where: {
      uuid: templateUuid,
    },
  });
};

export const getManyPublishedTemplatesByTree = async (
  publishedTreeUuid: string
) => {
  return prisma.publishedTemplate.findMany({
    where: {
      publishedTree: {
        uuid: publishedTreeUuid,
      },
    },
    select: {
      s3Key: true,
    },
  });
};
