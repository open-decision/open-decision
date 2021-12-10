import express, { Router } from "express";
import authRouter from "./auth.route";
// import * as userRoute from "./user.route";
// import * as docsRoute from "./docs.route";
import config from "../config/config";
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  // {
  //   path: "/users",
  //   route: userRoute,
  // },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.NODE_ENV === "development") {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
