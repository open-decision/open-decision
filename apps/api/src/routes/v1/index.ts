import express from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import publishedTreeRouter from "./publishedTree.route";
import graphqlRouter from "./graphql.route";
import docsRouter from "./docs.route";
import config from "../../config/config";
import treeRouter from "./tree.route";
const router = express.Router();

const defaultRoutes = [
  { path: "/auth", route: authRouter },
  { path: "/users", route: userRouter },
  { path: "/published", route: publishedTreeRouter },
  { path: "/graphql", route: graphqlRouter },
  { path: "/tree", route: treeRouter },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs/",
    route: docsRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.NODE_ENV === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

// make the docs public even in production, if explicitly required
if (config.PUBLIC_API_DOCUMENTATION !== "false") {
  router.use("/docs/", docsRouter);
}

export default router;
