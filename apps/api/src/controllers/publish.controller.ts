import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import {
  deletePublishedTreeInput,
  getPublishedTreeInput,
  TGetPublishedTreeOutput,
} from "@open-decision/tree-api-specification";
import prisma from "../init-prisma-client";
import { APIError } from "@open-decision/type-classes";

const getPublishedTrees = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getPublishedTreeInput)(req);

  type PrismaReturn = Omit<TGetPublishedTreeOutput, "createdAt" | "updatedAt">;

  const publishedTree: PrismaReturn[] | PrismaReturn | null =
    await prisma.publishedTree.findMany({
      where: {
        uuid: reqData.params?.uuid,
      },
    });

  if (!publishedTree)
    throw new ApiError({
      message: "Published tree not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(publishedTree);
});

const getPublishedTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(getPublishedTreeInput)(req);

  type PrismaReturn = Omit<TGetPublishedTreeOutput, "createdAt" | "updatedAt">;

  const publishedTree: PrismaReturn | null =
    await prisma.publishedTree.findFirst({
      where: {
        uuid: reqData.params.uuid,
      },
    });

  if (!publishedTree)
    throw new APIError({
      message: "Published Trees not found.",
      code: "NOT_FOUND",
    });

  res.send(publishedTree);
});

const deletePublishedTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(deletePublishedTreeInput)(req);

  const deletedTree = await prisma.publishedTree.deleteMany({
    where: {
      ownerUuid: req.user.uuid,
      uuid: reqData.params.uuid,
    },
  });

  if (deletedTree.count == 0)
    throw new APIError({ code: "NOT_FOUND", message: "Tree not found." });

  res.status(httpStatus.NO_CONTENT).send();
});

export const publishController = {
  getPublishedTrees,
  getPublishedTree,
  deletePublishedTree,
};
