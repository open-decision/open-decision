import {
  publishedTreesOfTreesCollection,
  treesRoot,
  treesSingle,
  treeDataSingle,
  treePreview,
} from "@open-decision/api-specification";
import express from "express";
import * as treeController from "../../controllers/tree.controller";
import { auth } from "../../middlewares/auth";
const treeRouter = express.Router();

treeRouter
  .route(`/${treesRoot}`)
  .get(auth(), treeController.getDecisionTreeCollection)
  .post(auth(), treeController.createDecisionTree);

treeRouter
  .route(`/${treesSingle(":uuid")}`)
  .get(auth(), treeController.getDecisionTree)
  .patch(auth(), treeController.updateDecisionTree)
  .delete(auth(), treeController.deleteDecisionTree);

treeRouter
  .route(`/${treeDataSingle(":uuid")}`)
  .get(auth(), treeController.getCurrentTreeData);

treeRouter.route(`/${treePreview(":uuid")}`).get(treeController.getTreePreview);

treeRouter
  .route(`/${publishedTreesOfTreesCollection(":treeUuid")}`)
  .get(auth(), treeController.getPublishedTrees)
  .post(auth(), treeController.createPublishedTree);

export default treeRouter;
