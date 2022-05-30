import express from "express";
import { treeController } from "../../controllers/tree.controller";
import { auth } from "../../middlewares/auth";
const treeRouter = express.Router();

treeRouter.route("/trees").get(auth(), treeController.getDecisionTrees);
treeRouter.route("/:treeUuid").get(auth(), treeController.getDecisionTree);

export default treeRouter;
