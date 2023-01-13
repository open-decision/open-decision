import express from "express";
import * as documentTemplateController from "../../controllers/documentTemplate.controller";
import { auth } from "../../middlewares/auth";
import multer from "multer";
import * as documentGenerationController from "../../controllers/documentGeneration.controller";
import {
  templateRoot,
  templateDownloadUrlSingle,
  templateSingle,
  documentPreviewSingle,
  documentPrototypeSingle,
  documentPublishedSingle,
  templateUploadRoot,
  templateRequestUploadToken,
} from "@open-decision/api-specification";
const fileRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 20,
  },
});

fileRouter.post(
  `/${templateRequestUploadToken}`,
  auth(),
  documentTemplateController.requestDocumentTemplateUpload
);

fileRouter.post(
  `/${templateUploadRoot}`,
  upload.single("template"),
  documentTemplateController.uploadDocumentTemplate
);

fileRouter.get(
  `/${templateDownloadUrlSingle(":uuid")}`,
  auth(),
  documentTemplateController.getTemplateDownloadUrl
);

fileRouter.get(
  `/${templateSingle(":uuid")}`,
  auth(),
  documentTemplateController.getSingleDocumentMetadata
);

fileRouter.delete(
  `/${templateSingle(":uuid")}`,
  auth(),
  documentTemplateController.deleteDocumentTemplate
);

fileRouter.get(
  `/${templateRoot}`,
  auth(),
  documentTemplateController.getDocumentTemplateCollection
);

fileRouter.post(
  `/${documentPreviewSingle(":uuid")}`,
  auth(),
  documentGenerationController.generateDocumentForPreview
);

fileRouter.post(
  `/${documentPrototypeSingle(":uuid")}`,
  documentGenerationController.generateDocumentForPrototype
);

fileRouter.post(
  `/${documentPublishedSingle(":uuid")}`,
  documentGenerationController.generateDocumentForPublishedTree
);

export default fileRouter;
