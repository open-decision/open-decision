import { Request, Response } from "express";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import { APIError } from "@open-decision/type-classes";
import catchAsync from "../utils/catchAsync";
import * as documentTemplateService from "../services/documentTemplate.service";
import {
  hasPermissionsForDocumentTemplate,
  hasPermissionsForTree,
} from "../services/permission.service";
import * as validations from "@open-decision/api-specification";
import { tokenService } from "../services";
import { tokenHandler } from "../models/token.model";
import { TokenType } from "@prisma/client";

export const requestDocumentTemplateUpload = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(
      validations.requestTemplateUploadInput
    )(req);

    const hasPermissions = reqData.body.templateUuid
      ? await hasPermissionsForDocumentTemplate(
          req.user.uuid,
          reqData.body.templateUuid
        )
      : await hasPermissionsForTree(req.user.uuid, reqData.body.treeUuid);
    if (!hasPermissions) {
      throw new APIError({
        code: "UNAUTHORIZED",
        message:
          "You have no permission to upload or update a template for this project.",
      });
    }

    const uploadToken = await tokenService.generateFileUploadToken(
      req.user.uuid,
      reqData.body.treeUuid,
      reqData.body.templateUuid
    );
    res.send({ token: uploadToken });
  }
);

export const uploadDocumentTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(validations.createTemplateInputApi)(
      req
    );

    const { treeUuid, userUuid, updateTemplateUuid } =
      await tokenService.verifyFileUploadToken(reqData.query.token);
    const uploadedDocument = updateTemplateUuid
      ? await documentTemplateService.updateDocumentTemplate(
          reqData.file.buffer,
          userUuid,
          updateTemplateUuid!,
          reqData.body.displayName
        )
      : await documentTemplateService.uploadDocumentTemplate(
          reqData.file.buffer,
          userUuid,
          treeUuid,
          reqData.body.displayName
        );

    const tokenToDelete = await tokenHandler.findOne({
      token: reqData.query.token,
      type: TokenType.UPLOAD_FILE,
    });

    tokenToDelete
      ? await tokenHandler.deleteFromDbById(tokenToDelete?.id)
      : null;

    if (uploadedDocument instanceof APIError) {
      throw uploadedDocument;
    }

    res
      .status(httpStatus.CREATED)
      .send(
        uploadedDocument as Omit<
          validations.TCreateTemplateOutput,
          "createdAt" | "updatedAt"
        >
      );
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
    res.send(
      documentDataWithUrl as Omit<
        validations.TGetTemplateFileSingleOutput,
        "createdAt" | "updatedAt"
      >
    );
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
    res.send(
      documentData as Omit<
        validations.TGetTemplateSingleOutput,
        "createdAt" | "updatedAt"
      >
    );
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

export const deleteDocumentTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const deleted = await documentTemplateService.deleteDocumentTemplate(
      req.user.uuid,
      req.params.uuid
    );
    res.send(deleted);
  }
);
