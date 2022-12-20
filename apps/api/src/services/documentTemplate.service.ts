import * as FiletypeLib from "file-type";
import fetch from "node-fetch";
import { APIError } from "@open-decision/type-classes";
import { DocumentTemplate } from "@prisma/client";
import * as s3Service from "./s3.service";
import * as documentTemplateModel from "../models/documentTemplate.model";
import { createManyPublishedTemplates } from "../models/publishedTemplate.model";
import { FileType } from "@prisma/client";
import { v4 as uuidV4 } from "uuid";
import config from "../config/config";

export const uploadDocumentTemplate = async (
  file: Buffer,
  userUuid: string,
  treeUuid: string,
  displayName: string,
  updateTemplateUuid: string | undefined = undefined
) => {
  const fileType = await FiletypeLib.fromBuffer(file);
  if (
    fileType == undefined ||
    !(
      fileType.mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) ||
    !(fileType.ext === "docx")
  ) {
    throw new APIError({
      code: "INVALID_FILETYPE",
      message:
        "We only support .docx files, please create the template with Office 2007 or newer.",
      isOperational: true,
    });
  }
  const templateUuid = updateTemplateUuid ? updateTemplateUuid : uuidV4();
  const s3Key = generatePrivateDocPath({ treeUuid, templateUuid });
  const uploadedDoc = await s3Service.uploadFromBuffer(
    file,
    config.DOCUMENT_TEMPLATE_BUCKET,
    s3Key
  );

  if (!uploadedDoc.Location) {
    throw new APIError({
      code: "TEMPLATE_UPLOAD_FAILED",
    });
  }

  const templateVariables = await checkTemplateValidityAndGetVariables(
    config.DOCUMENT_TEMPLATE_BUCKET,
    s3Key
  );

  if (templateVariables instanceof APIError) {
    s3Service.deleteFile(config.DOCUMENT_TEMPLATE_BUCKET, s3Key);
    throw templateVariables;
  }

  if (!updateTemplateUuid) {
    return documentTemplateModel.createDocumentTemplate({
      templateUuid,
      userUuid,
      treeUuid,
      displayName,
      fileType: FileType.DOCX,
      s3Key,
      fullS3Path: uploadedDoc.Location,
      s3BucketName: config.DOCUMENT_TEMPLATE_BUCKET,
    });
  } else {
    const updated = await documentTemplateModel.updateDocumentTemplate(
      userUuid,
      templateUuid,
      {
        displayName: displayName,
      }
    );
    if (updated.count == 0) {
      throw new APIError({ code: "FILE_UPDATED_UPDATE_DB_ENTRY_FAILED" });
    }
    return getSingleDocument(userUuid, templateUuid);
  }
};

export const checkTemplateValidityAndGetVariables = async (
  bucket: string,
  s3key: string
) => {
  const presignedUrl = await s3Service.getPresignedDownloadUrl(
    bucket,
    s3key,
    60
  );
  const response = await fetch(
    `${config.OD_BUILDER_ENDPOINT}/api/validate-template`,
    {
      method: "post",
      body: JSON.stringify({ templateUrl: presignedUrl }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const resJson = (await response.json()) as any;
  if (!resJson.isValid) {
    return new APIError({
      code: "INVALID_DOCUMENT_TEMPLATE",
      message: resJson.error,
    });
  } else {
    return { isValid: resJson.isValid, variables: resJson.variables };
  }
};

export const getDownloadUrl = async (
  userUuid: string,
  documentUuid: string,
  urlExpiry: number
) => {
  const dbEntry = await documentTemplateModel.getSingleDocumentTemplate(
    userUuid,
    documentUuid
  );
  if (!dbEntry) {
    throw new APIError({ code: "NO_ACCESSIBLE_OBJECT_FOUND" });
  }

  const url = await s3Service.getPresignedDownloadUrl(
    dbEntry.s3BucketName,
    dbEntry.s3Key,
    urlExpiry
  );
  if (!url) {
    throw new APIError({ code: "NOT_FOUND" });
  }
  return { url, ...dbEntry };
};

export const getSingleDocument = async (
  userUuid: string,
  templateUuid: string
) => {
  const dbEntry = await documentTemplateModel.getSingleDocumentTemplate(
    userUuid,
    templateUuid
  );
  if (!dbEntry) {
    throw new APIError({ code: "NO_ACCESSIBLE_OBJECT_FOUND" });
  }
  return dbEntry;
};

export const getDocumentTemplateCollection = async (userUuid: string) => {
  return documentTemplateModel.getManyDocumentTemplate(userUuid);
};

export const updateDocumentTemplate = async (
  file: Buffer,
  userUuid: string,
  templateUuid: string,
  displayName: string
) => {
  const existingTemplate = await getSingleDocument(userUuid, templateUuid);
  return uploadDocumentTemplate(
    file,
    userUuid,
    existingTemplate.treeUuid,
    displayName,
    templateUuid
  );
};

export const deleteDocumentTemplate = async (
  userUuid: string,
  templateUuid: string
) => {
  const template = await getSingleDocument(userUuid, templateUuid);
  s3Service.deleteFile(template.s3BucketName, template.s3Key);
  return documentTemplateModel.deleteDocumentTemplate(userUuid, templateUuid);
};

export const createPublishedTemplatesForTree = async (
  treeUuid: string,
  publishedTreeUuid: string
) => {
  const relatedTemplates = await documentTemplateModel.getTemplatesForTree(
    treeUuid
  );

  const createPublishedData: newDocumentTemplateInterface[] = [];
  const templateMapping: [string, string][] = [];
  //begin for loop
  for (const template of relatedTemplates) {
    // const newUuid = uuidV4();
    const newUuid = template.uuid;
    const source = `${template.s3BucketName}/${template.s3Key}`;
    const destinationKey = `templates/public/${publishedTreeUuid}/${newUuid}.docx`;
    const uploadedDoc = await s3Service.copyAndRenameFile(
      config.DOCUMENT_TEMPLATE_BUCKET,
      source,
      destinationKey
    );
    if (uploadedDoc.$response.error) {
      throw new APIError({
        code: "PUBLISHING_OF_TEMPLATES_FAILED",
        isOperational: false,
      });
    }
    createPublishedData.push({
      ...template,
      publishedData: {
        uuid: newUuid,
        s3Key: destinationKey,
        s3BucketName: config.DOCUMENT_TEMPLATE_BUCKET,
      },
    });

    templateMapping.push([template.uuid, newUuid]);
  }
  // end of for loop
  const publishedTemplates = await createManyPublishedTemplates(
    createPublishedData,
    publishedTreeUuid
  );

  return { publishedTemplates, templateMapping };
};
const generatePrivateDocPath = ({
  treeUuid,
  templateUuid,
}: {
  treeUuid: string;
  templateUuid: string;
}) => `templates/private/${treeUuid}/${templateUuid}.docx`;

export interface newDocumentTemplateInterface extends DocumentTemplate {
  publishedData: {
    uuid: string;
    s3Key: string;
    s3BucketName: string;
  };
}
