import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import {
  getTreeInput,
  getTreesInput,
  TGetTreeOutput,
} from "@open-decision/tree-api-specification";
import prisma from "../init-prisma-client";

const prismaSelectionForTree = {
  publishedTrees: { select: { uuid: true } },
  createdAt: true,
  updatedAt: true,
  name: true,
  status: true,
  uuid: true,
  ownerUuid: true,
};

const getDecisionTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getTreeInput)(req);

  const tree: Omit<TGetTreeOutput, "createdAt" | "updatedAt"> | null =
    await prisma.decisionTree.findFirst({
      where: {
        ownerUuid: req.user.uuid,
        uuid: reqData.params.treeUuid,
      },
      select: prismaSelectionForTree,
    });

  if (!tree)
    throw new ApiError({
      message: "Tree not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(tree);
});

const getDecisionTrees = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getTreesInput)(req);

  const trees: Omit<TGetTreeOutput, "createdAt" | "updatedAt">[] =
    await prisma.decisionTree.findMany({
      where: {
        status: reqData.query?.status,
        name: {
          contains: reqData.query?.name,
        },
        ownerUuid: req.user.uuid,
      },
      select: prismaSelectionForTree,
    });

  if (!trees)
    throw new ApiError({
      message: "Trees not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(trees);
});

const createDecisionTree = catchAsync(async (req: Request, res: Response) => {
  // const reqData = await validateRequest(createTreeInput)(req);
  let reqData: any;

  const tree = await prisma.decisionTree.create({
    data: {
      name: reqData.body.name,
      owner: { connect: { uuid: req.user.uuid } },
    },
    select: prismaSelectionForTree,
  });

  res.status(httpStatus.CREATED).send(tree);
});

const deleteDecisionTree = catchAsync(async (req: Request, res: Response) => {
  // const reqData = await validateRequest(deleteTreeInput)(req);
  let reqData: any;

  const deletedTree = await prisma.decisionTree.deleteMany({
    where: {
      ownerUuid: req.user.uuid,
      uuid: reqData.params.treeUuid,
    },
  });
  if (deletedTree.count == 0) throw new ApiError({ message: "Not found." });
  res.status(httpStatus.NO_CONTENT).send();
});

const updateDecisionTree = catchAsync(async (req: Request, res: Response) => {
  // const reqData = await validateRequest(updateTreeInput)(req);
  let reqData: any;

  const updatedTree = await prisma.decisionTree.updateMany({
    data: {
      name: reqData.body.name,
      status: reqData.body.status,
    },
    where: {
      ownerUuid: req.user.uuid,
      uuid: reqData.params.treeUuid,
    },
  });
  if (updatedTree.count == 0) throw new ApiError({ message: "Not found." });
  res.send(updatedTree[0]);
});

export const treeController = {
  getDecisionTree,
  getDecisionTrees,
  createDecisionTree,
  deleteDecisionTree,
  updateDecisionTree,
};
