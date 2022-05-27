import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { getPublishedTreeFromDb } from "../models/publishedTree.model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import validateRequest from "../validations/validateRequest";
import { publishedTreeValidation } from "../validations";

const getPublishedTree = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(
    publishedTreeValidation.getPublishedTree
  )(req);

  const { publishedTreeUuid } = reqData.params;
  const publishedTree = await getPublishedTreeFromDb(publishedTreeUuid);

  if (!publishedTree)
    throw new ApiError({
      message: "Published tree not found.",
      statusCode: httpStatus.NOT_FOUND,
    });

  res.send(publishedTree);
});

export const publishController = {
  getPublishedTree,
};
