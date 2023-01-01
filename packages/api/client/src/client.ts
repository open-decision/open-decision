import { TContext, FetchFunctions } from "@open-decision/api-helpers";
import {
  deletePublishedTree,
  getPublishedTree,
  getPublishedTrees,
  getTreeData,
  createPublishedTreeOfTree,
  createTree,
  deleteTree,
  getPublishedTreesOfTree,
  getTree,
  getTrees,
  updateTree,
  getTreePreview,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  deleteUser,
  getUser,
  updateUser,
  getDocumentPreviewSingle,
  getDocumentPublishedSingle,
  getDocumentPrototypeSingle,
  getTemplateCollection,
  createTemplate,
  getTemplateSingle,
  updateTemplate,
  deleteTemplateSingle,
  getTemplateFileUrlSingle,
} from "@open-decision/api-specification";

export const client = <FetchFunction extends FetchFunctions>(
  context: TContext<FetchFunction>
) => {
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
      data: {
        get: getTreeData(context),
        getPreview: getTreePreview(context),
      },
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
    file: {
      document: {
        get: {
          preview: getDocumentPreviewSingle(context),
          prototype: getDocumentPrototypeSingle(context),
          public: getDocumentPublishedSingle(context),
        },
      },
      template: {
        getSingle: getTemplateSingle(context),
        getCollection: getTemplateCollection(context),
        create: createTemplate(context),
        update: updateTemplate(context),
        delete: deleteTemplateSingle(context),
        getFileUrl: getTemplateFileUrlSingle(context),
      },
    },
  };
};

export type TClient = ReturnType<typeof client>;
