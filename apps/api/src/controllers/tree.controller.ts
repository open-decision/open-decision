import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import * as TreeService from "../services/tree.service";
import * as TreeModel from "../models/decisionTree.model";
import * as apiSpecification from "@open-decision/api-specification";
import { APIError } from "@open-decision/type-classes";
import { publishDecisionTree } from "../models/publishedTree.model";
import { createPublishedTemplatesForTree } from "../services/documentTemplate.service";

export const createDecisionTree = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.createTreeInput)(
      req
    );
    const tree = await TreeModel.createTree(
      req.user.uuid,
      reqData.body.name,
      reqData.body.status
    );
    res
      .status(httpStatus.CREATED)
      .send(
        tree as Omit<
          apiSpecification.TCreateTreeOutput,
          "createdAt" | "updatedAt"
        >
      );
  }
);

export const getDecisionTreeCollection = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.getTreesInput)(req);
    type PrismaReturn = Omit<
      apiSpecification.TGetTreeOutput,
      "createdAt" | "updatedAt"
    >;
    const trees: PrismaReturn[] =
      await TreeService.getDecisionTreeCollectionWithPublishedTrees(
        req.user.uuid,
        { nameContains: reqData.query?.name, status: reqData.query?.status }
      );

    if (!trees)
      throw new APIError({
        message: "Trees not found.",
        code: "NOT_FOUND",
      });

    res.send(trees as apiSpecification.TGetTreesOutput);
  }
);

export const getDecisionTree = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.getTreeInput)(req);

    const tree = await TreeService.getTreeWithPublishedTrees(
      req.user.uuid,
      reqData.params.uuid
    );

    if (!tree)
      throw new APIError({
        message: "Tree not found.",
        code: "NOT_FOUND",
      });

    res.send(
      tree as Omit<apiSpecification.TGetTreeOutput, "createdAt" | "updatedAt">
    );
  }
);

export const getCurrentTreeData = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.getTreeDataInput)(
      req
    );

    const tree = await TreeService.getTreeWithUpdatedTreeData(
      reqData.params.uuid,
      req.user.uuid
    );

    res.send(tree.treeData as apiSpecification.TGetTreeDataOutput);
  }
);

export const getTreePreview = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.getTreeDataInput)(
      req
    );

    const tree = await TreeService.getTreeWithUpdatedTreeData(
      reqData.params.uuid
    );

    res.send(tree.treeData as apiSpecification.TGetTreePreviewOutput);
  }
);

export const deleteDecisionTree = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.deleteTreeInput)(
      req
    );

    const deletedTree = await TreeModel.deleteTree(
      req.user.uuid,
      reqData.params.uuid
    );

    if (deletedTree.count == 0)
      throw new APIError({ code: "NOT_FOUND", message: "Tree not found." });

    res.status(httpStatus.NO_CONTENT).send();
  }
);

export const updateDecisionTree = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(apiSpecification.updateTreeInput)(
      req
    );

    const updatedTree = await TreeModel.updateTree(
      req.user.uuid,
      reqData.params.uuid,
      reqData.body
    );

    if (updatedTree.count == 0)
      throw new APIError({ code: "NOT_FOUND", message: "Tree not found." });

    res.status(httpStatus.NO_CONTENT).send();
  }
);

export const getPublishedTrees = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(
      apiSpecification.getPublishedTreeInput
    )(req);

    type PrismaReturn = Omit<
      apiSpecification.TGetPublishedTreesOfTreeOutput[number],
      "createdAt" | "updatedAt"
    >;
    const publishedTrees: PrismaReturn[] =
      await TreeModel.getRelatedPublishedTrees(
        req.user.uuid,
        reqData.params.uuid
      );

    if (publishedTrees.length == 0)
      throw new APIError({
        message: "Published trees not found.",
        code: "NOT_FOUND",
      });

    res.send(publishedTrees as apiSpecification.TGetPublishedTreesOfTreeOutput);
  }
);

export const createPublishedTree = catchAsync(
  async (req: Request, res: Response) => {
    const reqData = await validateRequest(
      apiSpecification.createPublishedTreeInput
    )(req);

    const publishedTree = await publishDecisionTree(
      req.user.uuid,
      reqData.params.treeUuid
    );

    if (publishedTree instanceof Error) throw publishedTree;

    const _publishedTemplates = await createPublishedTemplatesForTree(
      reqData.params.treeUuid,
      publishedTree.uuid
    );

    // if (publishedTemplates.templateMapping.length > 0) {
    //   const { nodePlugins, treeClient } = createTreeClientWithPlugins(
    //     publishedTree.treeData as any
    //   );

    //   for (const mapping in publishedTemplates.templateMapping) {
    //     const nodes = nodePlugins.document.plugin.getByTemplateUuid(mapping[0])(
    //       treeClient
    //     );

    //     nodes.forEach((node) => {
    //       nodePlugins.document.plugin.updateTemplateUuid(
    //         node.id,
    //         mapping[1]
    //       )(treeClient);
    //     });
    //   }
    //   await updatePublishedTree(publishedTree.uuid, {
    //     treeData: treeClient.get.tree(),
    //   });
    // }

    res
      .status(httpStatus.CREATED)
      .send(
        publishedTree as Omit<
          apiSpecification.TCreatePublishedTreeOutput,
          "createdAt"
        >
      );
  }
);
