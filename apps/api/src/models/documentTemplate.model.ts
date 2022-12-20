import { APIError } from "@open-decision/type-classes";
import { FileType, DocumentTemplate } from "@prisma/client";
import prisma from "../init-prisma-client";
import { hasPermissionsForDocumentTemplate } from "../services/permission.service";

export const createDocumentTemplate = async ({
  templateUuid,
  treeUuid,
  userUuid,
  displayName,
  fileType,
  fullS3Path,
  s3Key,
  s3BucketName,
}: createDocumentParams) => {
  const documentTemplate = prisma.documentTemplate.create({
    data: {
      uuid: templateUuid,
      displayName,
      fileType,
      fullS3Path,
      s3Key,
      s3BucketName,
      owner: { connect: { uuid: userUuid } },
      decisionTree: { connect: { uuid: treeUuid } },
    },
  });

  return documentTemplate;
};

export const getSingleDocumentTemplate = async (
  userUuid: string,
  documentTemplateUuid: string
) => {
  const doc = prisma.documentTemplate.findFirst({
    where: {
      OR: [
        { uuid: documentTemplateUuid, ownerUuid: userUuid },
        {
          uuid: documentTemplateUuid,
          decisionTree: {
            ownerUuid: userUuid,
          },
        },
      ],
    },
  });
  return doc;
};

export const getSingleDocumentTemplateForPreview = async (
  documentTemplateUuid: string
) => {
  const doc = prisma.documentTemplate.findFirst({
    where: {
      uuid: documentTemplateUuid,
      decisionTree: {
        hasPreview: true,
      },
    },
  });
  return doc;
};

export const getManyDocumentTemplate = async (userUuid: string) => {
  return prisma.documentTemplate.findMany({
    where: {
      OR: [
        { ownerUuid: userUuid },
        {
          decisionTree: {
            ownerUuid: userUuid,
          },
        },
      ],
    },
  });
};

export const updateDocumentTemplate = async (
  userUuid: string,
  documentTemplateUuid: string,
  updateData: documentTemplateUpdateData
) => {
  return prisma.documentTemplate.updateMany({
    where: {
      ownerUuid: userUuid,
      uuid: documentTemplateUuid,
    },
    data: {
      ...updateData,
    },
  });
};

export const deleteDocumentTemplate = async (
  userUuid: string,
  documentTemplateUuid: string
) => {
  const hasPermissions = await hasPermissionsForDocumentTemplate(
    userUuid,
    documentTemplateUuid
  );

  if (!hasPermissions) {
    throw new APIError({ code: "FORBIDDEN" });
  }
  return prisma.documentTemplate.delete({
    where: {
      uuid: documentTemplateUuid,
    },
  });
};

export const getTemplatesForTree = async (treeUuid: string) => {
  return prisma.documentTemplate.findMany({
    where: {
      decisionTree: {
        uuid: treeUuid,
      },
    },
  });
};

interface createDocumentParams {
  templateUuid: string;
  treeUuid: string;
  userUuid: string;
  displayName: string;
  fileType: FileType;
  fullS3Path?: string;
  s3BucketName: string;
  s3Key: string;
}
type documentTemplateUpdateData = Pick<
  Partial<DocumentTemplate>,
  "displayName" | "fullS3Path" | "s3Key" | "s3BucketName"
>;
