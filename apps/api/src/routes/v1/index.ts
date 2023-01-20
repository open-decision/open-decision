import express from "express";
import authRouter from "./auth.route";
import fileRouter from "./file.route";
import { userRouter, usersRouter } from "./user.route";
import treeRouter from "./tree.route";
import publishedTreeRouter from "./publishedTree.route";
import { authRoot, userRoot } from "@open-decision/api-specification";
const router = express.Router();

const defaultRoutes = [
  { path: `/${authRoot}`, route: authRouter },
  { path: `/${userRoot}`, route: userRouter },
  { path: "/users", route: usersRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.use(treeRouter);
router.use(fileRouter);
router.use(publishedTreeRouter);

export default router;
