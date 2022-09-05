import {
  publishedTreesOfTreesCollection,
  treesCollection,
  treesSingle,
  treesDataSingle,
} from "@open-decision/tree-api-specification";
import express from "express";
import { treeController } from "../../controllers/tree.controller";
import { auth } from "../../middlewares/auth";
const treeRouter = express.Router();

treeRouter
  .route(treesCollection)
  .get(auth(), treeController.getDecisionTrees)
  .post(auth(), treeController.createDecisionTree);

treeRouter
  .route(treesSingle(":uuid"))
  .get(auth(), treeController.getDecisionTree)
  .patch(auth(), treeController.updateDecisionTree)
  .delete(auth(), treeController.deleteDecisionTree);

treeRouter
  .route(treesDataSingle(":uuid"))
  .get(treeController.getCurrentTreeData);

treeRouter
  .route(publishedTreesOfTreesCollection(":treeUuid"))
  .get(auth(), treeController.getPublishedTrees)
  .post(auth(), treeController.createPublishedTree);

export default treeRouter;
