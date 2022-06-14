import { ClientConfig } from "@open-decision/api-helpers";
import {
  deletePublishedTree,
  getPublishedTree,
  getPublishedTrees,
} from "./routes/publishedTrees";
import {
  createPublishedTreeOfTree,
  createTree,
  deleteTree,
  getPublishedTreesOfTree,
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
      get: getPublishedTreesOfTree(context),
      create: createPublishedTreeOfTree(context),
    },
  },
  publishedTrees: {
    getCollection: getPublishedTrees(context),
    getSingle: getPublishedTree(context),
    delete: deletePublishedTree(context),
  },
});
