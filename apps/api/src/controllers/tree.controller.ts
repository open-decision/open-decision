import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import {
  createPublishedTreeInput,
  createTreeInput,
  deleteTreeInput,
  getPublishedTreeInput,
  getTreeInput,
  getTreesInput,
  TCreatePublishedTreeOutput,
  TGetPublishedTreeOutput,
  TGetTreeOutput,
  updateTreeInput,
} from "@open-decision/tree-api-specification";
import prisma from "../init-prisma-client";
import { APIError } from "@open-decision/type-classes";

const prismaSelectionForTree = {
  publishedTrees: { select: { uuid: true } },
  createdAt: true,
  updatedAt: true,
  name: true,
  status: true,
  uuid: true,
  ownerUuid: true,
};

const getDecisionTrees = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getTreesInput)(req);

  type PrismaReturn = Omit<TGetTreeOutput, "createdAt" | "updatedAt">;

  const trees: PrismaReturn[] | null = await prisma.decisionTree.findMany({
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
    throw new APIError({
      message: "Trees not found.",
      code: "NOT_FOUND",
    });

  res.send(trees);
});

const getDecisionTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getTreeInput)(req);

  type PrismaReturn = Omit<TGetTreeOutput, "createdAt" | "updatedAt">;

  const trees: PrismaReturn[] | PrismaReturn | null = reqData.params?.uuid
    ? await prisma.decisionTree.findFirst({
        where: {
          ownerUuid: req.user.uuid,
          uuid: reqData.params.uuid,
        },
        select: prismaSelectionForTree,
      })
    : await prisma.decisionTree.findMany({
        where: { ownerUuid: req.user.uuid },
        select: prismaSelectionForTree,
      });

  if (!trees)
    throw new APIError({
      message: "Trees not found.",
      code: "NOT_FOUND",
    });

  res.send(trees);
});

const createDecisionTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(createTreeInput)(req);

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
  const reqData = await validateRequest(deleteTreeInput)(req);

  const deletedTree = await prisma.decisionTree.deleteMany({
    where: {
      ownerUuid: req.user.uuid,
      uuid: reqData.params.uuid,
    },
  });

  if (deletedTree.count == 0)
    throw new APIError({ code: "NOT_FOUND", message: "Tree not found." });

  res.status(httpStatus.NO_CONTENT).send();
});

const updateDecisionTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(updateTreeInput)(req);

  const updatedTree = await prisma.decisionTree.updateMany({
    data: {
      name: reqData.body.name,
      status: reqData.body.status,
    },
    where: {
      ownerUuid: req.user.uuid,
      uuid: reqData.params.uuid,
    },
  });

  if (updatedTree.count == 0)
    throw new APIError({ code: "NOT_FOUND", message: "Tree Not found." });

  res.status(httpStatus.NO_CONTENT).send();
});

const getPublishedTrees = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getPublishedTreeInput)(req);

  const publishedTree: TGetPublishedTreeOutput =
    await prisma.publishedTree.findMany({
      where: {
        originTreeUuid: reqData.params.treeUuid,
      },
    });

  if (!publishedTree)
    throw new APIError({
      message: "Published tree not found.",
      code: "NOT_FOUND",
    });

  res.send(publishedTree);
});

const createPublishedTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(createPublishedTreeInput)(req);

  const publishedTree: TCreatePublishedTreeOutput =
    await prisma.publishedTree.create({
      data: {
        originTree: { connect: { uuid: reqData.params.treeUuid } },
        name: reqData.body.name,
        owner: { connect: { uuid: req.user.uuid } },
      },
    });

  res.status(httpStatus.CREATED).send(publishedTree);
});

export const treeController = {
  getDecisionTrees,
  getDecisionTree,
  createDecisionTree,
  deleteDecisionTree,
  updateDecisionTree,
  getPublishedTrees,
  createPublishedTree,
};
