import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import { getTreeInput } from "@open-decision/tree-api-specification";
import { getTreeWithUpdatedTreeData } from "../models/decisionTree.model";
import prisma from "../init-prisma-client";

const getDecisionTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getTreeInput)(req);

  const tree = await getTreeWithUpdatedTreeData(
    req.user.uuid,
    reqData.params.treeUuid
  );

  if (!tree)
    throw new ApiError({
      message: "Published tree not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(tree);
});

const getDecisionTrees = catchAsync(async (req: Request, res: Response) => {
  const trees = await prisma.decisionTree.findMany({
    where: {
      ownerUuid: req.user.uuid,
    },
    include: {
      publishedTrees: {
        select: {
          uuid: true,
        },
      },
    },
  });

  if (!trees)
    throw new ApiError({
      message: "Published tree not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(trees);
});

export const treeController = {
  getDecisionTree,
  getDecisionTrees,
};
