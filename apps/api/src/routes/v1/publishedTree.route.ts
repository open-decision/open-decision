import {
  publishedTreesRoot,
  publishedTreesSingle,
} from "@open-decision/api-specification";
import express from "express";
import { publishController } from "../../controllers/publish.controller";
import { auth } from "../../middlewares/auth";
const publishedTreeRouter = express.Router();

publishedTreeRouter
  .route(`/${publishedTreesRoot}`)
  .get(publishController.getPublishedTrees);

publishedTreeRouter
  .route(`/${publishedTreesSingle(":uuid")}`)
  .get(publishController.getPublishedTree)
  .delete(auth(), publishController.deletePublishedTree);

export default publishedTreeRouter;

/**
 * @openapi
 * tags:
 *   name: Published Trees
 *   description: Get published trees by uuid
 */

/**
 * @openapi
 * /published/{publishedTreeUuid}:
 *   get:
 *     summary: Get a published tree
 *     description: A published tree is public to anyone with the uuid.
 *     tags: [PublishedTree]
 *     parameters:
 *       - in: path
 *         name: publishedTreeUuid
 *         required: true
 *         schema:
 *           type: string
 *         description: Uuid of a published tree
 *     responses:
 *       "200":
 *         description: See the current tree schema in the Open Decision documentation.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PublishedTree'
 *       "404":
 *         $ref: '#/components/responses/NotFound'

 */
