import { Request, Response } from "express";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import { APIError } from "@open-decision/type-classes";
import catchAsync from "../utils/catchAsync";
import * as documentTemplateService from "../services/documentTemplate.service";
import { hasPermissionsForTree } from "../services/permission.service";
import * as validations from "@open-decision/api-specification";

export const uploadDocumentTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(validations.createTemplateInputApi)(
      req
    );
    if (!(await hasPermissionsForTree(req.user.uuid, reqData.body.treeUuid))) {
      throw new APIError({
        code: "UNAUTHORIZED",
        message:
          "You have no permission to upload a template for this project.",
      });
    }

    const uploadedDocument =
      await documentTemplateService.uploadDocumentTemplate(
        reqData.file.buffer,
        req.user.uuid,
        reqData.body.treeUuid,
        reqData.body.displayName
      );

    res
      .status(httpStatus.CREATED)
      .send(uploadedDocument as validations.TCreateTemplateOutput);
  }
);

export const getTemplateDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(
      validations.getTemplateFileSingleInput
    )(req);
    const documentDataWithUrl = await documentTemplateService.getDownloadUrl(
      req.user.uuid,
      reqData.params.uuid,
      60
    );
    res.send(documentDataWithUrl as validations.TGetTemplateFileSingleOutput);
  }
);

export const getSingleDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(validations.getTemplateSingleInput)(
      req
    );
    const documentData = await documentTemplateService.getSingleDocument(
      req.user.uuid,
      reqData.params.uuid
    );
    res.send(documentData as validations.TGetTemplateFileSingleOutput);
  }
);

export const getDocumentTemplateCollection = catchAsync(
  async (req: Request, res: Response) => {
    const documentData =
      await documentTemplateService.getDocumentTemplateCollection(
        req.user.uuid
      );
    res.send(documentData as validations.TGetTemplateCollectionOutput);
  }
);

export const updateDocumentTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(validations.updateTemplateInput)(req);
    const updatedTemplate =
      await documentTemplateService.updateDocumentTemplate(
        reqData.file.buffer,
        req.user.uuid,
        reqData.params.uuid,
        reqData.body.displayName
      );
    res.send(updatedTemplate as validations.TCreateTemplateOutput);
  }
);

export const deleteDocumentTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const deleted = await documentTemplateService.deleteDocumentTemplate(
      req.user.uuid,
      req.params.uuid
    );
    res.send(deleted);
  }
);
