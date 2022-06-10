import { ClientConfig } from "@open-decision/api-helpers";
import { deletePublishedTree } from "./routes/publishedTrees/delete";
import {
  createPublishedTree,
  createTree,
  deleteTree,
  getPublishedTrees,
  getTree,
  getTrees,
  updateTree,
} from "./routes/trees";

export const client = (context: ClientConfig) => ({
  trees: {
    getSingle: getTree(context),
    getCollection: getTrees(context),
    create: createTree(context),
    delete: deleteTree(context),
    update: updateTree(context),
    publishedTrees: {
      get: getPublishedTrees(context),
      create: createPublishedTree(context),
    },
  },
  publishedTrees: {
    get: getPublishedTrees(context),
    delete: deletePublishedTree(context),
  },
});
