/* This service handles everything connected to the publishing of trees and the related templates*/
import * as publishedTreeModel from "../models/publishedTree.model";
import * as publishedTemplateModel from "../models/publishedTemplate.model";
import * as s3Service from "../services/s3.service";
import * as permissionService from "../services/permission.service";
import { APIError } from "@open-decision/type-classes";
import config from "../config/config";

// export const publishDecisionTree = () => {};

export const deletePublishedTree = async (
  userUuid: string,
  publishedTreeUuid: string
) => {
  const hasPermissions = await permissionService.hasPermissionsForPublishedTree(
    userUuid,
    publishedTreeUuid
  );

  if (!hasPermissions) {
    throw new APIError({
      code: "NOT_FOUND",
      message: "Published Tree not found.",
    });
  }

  const relatedTemplateKeys =
    await publishedTemplateModel.getManyPublishedTemplatesByTree(
      publishedTreeUuid
    );

  s3Service.deleteMany(
    config.DOCUMENT_TEMPLATE_BUCKET,
    relatedTemplateKeys.map((value) => value.s3Key)
  );

  // This deletes related published templates as well due to cascading deletes
  return publishedTreeModel.deletePublishedTree(publishedTreeUuid);
};
