import { TContext } from "@open-decision/api-helpers";
import {
  deletePublishedTree,
  getPublishedTree,
  getPublishedTrees,
} from "@open-decision/tree-api-specification";
import {
  createPublishedTreeOfTree,
  createTree,
  deleteTree,
  getPublishedTreesOfTree,
  getTree,
  getTrees,
  updateTree,
} from "@open-decision/tree-api-specification";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
} from "@open-decision/auth-api-specification";
import {
  deleteUser,
  getUser,
  updateUser,
} from "@open-decision/user-api-specification";

export const client = (context: TContext) => {
  return {
    auth: {
      login: login(context),
      register: register(context),
      refreshToken: refreshToken(context),
      resetPassword: resetPassword(context),
      forgotPassword: forgotPassword(context),
      verifyEmail: verifyEmail(context),
      logout: logout(context),
    },
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
    user: {
      getUser: getUser(context),
      updateUser: updateUser(context),
      deleteUser: deleteUser(context),
    },
  };
};

export type TClient = ReturnType<typeof client>;
