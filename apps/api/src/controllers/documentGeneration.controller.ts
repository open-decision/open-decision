import { Request, Response } from "express";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import catchAsync from "../utils/catchAsync";
import validateRequest from "../validations/validateRequest";
import { APIError } from "@open-decision/type-classes";
import * as documentTemplateModel from "../models/documentTemplate.model";
import { getSinglePublishedTemplate } from "../models/publishedTemplate.model";
import * as s3Service from "../services/s3.service";
import fetch from "node-fetch";
import config from "../config/config";
import { DocumentTemplate, PublishedTemplate } from "@prisma/client";
import * as validations from "@open-decision/api-specification";

const streamPipeline = promisify(pipeline);

export const generateDocumentForPreview = catchAsync(
  async (req: Request, res: Response) => {
    if (!config.OD_BUILDER_ENDPOINT) {
      throw new APIError({
        code: "DOC_GENERATION_NOT_CONFIGURED",
      });
    }
    const reqData = await validateRequest(validations.getDocumentSingleInput)(
      req
    );

    const template = await documentTemplateModel.getSingleDocumentTemplate(
      req.user.uuid,
      reqData.params.uuid
    );
    return fetchAndReturnDocument(template, reqData.body.variables, res);
  }
);

export const generateDocumentForPrototype = catchAsync(
  async (req: Request, res: Response) => {
    if (!config.OD_BUILDER_ENDPOINT) {
      throw new APIError({
        code: "DOC_GENERATION_NOT_CONFIGURED",
      });
    }

    const reqData = await validateRequest(validations.getDocumentSingleInput)(
      req
    );

    const template =
      await documentTemplateModel.getSingleDocumentTemplateForPreview(
        reqData.params.uuid
      );
    return fetchAndReturnDocument(template, reqData.body.variables, res);
  }
);

export const generateDocumentForPublishedTree = catchAsync(
  async (req: Request, res: Response) => {
    if (!config.OD_BUILDER_ENDPOINT) {
      throw new APIError({
        code: "DOC_GENERATION_NOT_CONFIGURED",
      });
    }
    const reqData = await validateRequest(validations.getDocumentSingleInput)(
      req
    );

    const template = await getSinglePublishedTemplate(reqData.params.uuid);
    if (!template || !template.s3Key.includes("/public/")) {
      throw new APIError({
        code: "NO_ACCESSIBLE_OBJECT_FOUND",
      });
    }

    return fetchAndReturnDocument(template, reqData.body.variables, res);
  }
);

const fetchAndReturnDocument = async (
  template: DocumentTemplate | PublishedTemplate | null,
  variables: any,
  res: Response
) => {
  if (!template) {
    throw new APIError({
      code: "NO_ACCESSIBLE_OBJECT_FOUND",
    });
  }
  const presignedUrl = s3Service.getPresignedDownloadUrl(
    template.s3BucketName,
    template.s3Key,
    30
  );
  const body = {
    templateUrl: presignedUrl,
    variables: variables,
  };

  const docResponse = await fetch(
    `${config.OD_BUILDER_ENDPOINT}/api/generate-document`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (docResponse.status != 200) {
    const errData = (await docResponse.json()) as any;
    throw new APIError({
      code: "DOC_GENERATION_FAILED",
      message: errData.Error.message,
    });
  } else {
    await streamPipeline(docResponse.body as any, res);
  }
};
