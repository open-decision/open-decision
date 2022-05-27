import express from "express";
import validateRequest from "../../validations/validateRequest";
import { publishedTreeValidation } from "../../validations";
import { publishController } from "../../controllers";
const publishedTreeRouter = express.Router();

publishedTreeRouter
  .route("/:publishedTreeUuid")
  .get(
    validateRequest(publishedTreeValidation.getPublishedTree),
    publishController.getPublishedTree
  );
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
