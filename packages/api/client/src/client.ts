import {
  ClientFetchFnWithParse,
  safeFetchWithParse,
  TClientConfig,
} from "@open-decision/api-helpers";
import {
  deletePublishedTree,
  getPublishedTree,
  getPublishedTrees,
  getPrivateTreeContent,
  createPublishedTreeOfTree,
  createTree,
  deleteTree,
  getPublishedTreesOfTreeContent,
  getTree,
  getTrees,
  updateTree,
  getSharedTreeContent,
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
  getPrivateDocument,
  getPublishedDocument,
  getSharedDocument,
  getTemplateCollection,
  createTemplate,
  getTemplateSingle,
  updateTemplate,
  deleteTemplateSingle,
  getTemplateFileUrlSingle,
  requestTemplateUpload,
  getToken,
  verifyLogin,
} from "@open-decision/api-specification";

export const createAPIClient =
  (context: TClientConfig) =>
  (baseFetchFunction: ClientFetchFnWithParse = safeFetchWithParse) => {
    const fetchFunction = baseFetchFunction(context);

    return {
      auth: {
        login: login(fetchFunction, context),
        register: register(fetchFunction, context),
        refreshToken: refreshToken(fetchFunction, context),
        resetPassword: resetPassword(fetchFunction, context),
        forgotPassword: forgotPassword(fetchFunction, context),
        verifyEmail: verifyEmail(fetchFunction, context),
        logout: logout(fetchFunction, context),
        getToken: getToken(fetchFunction, context),
        verifyLogin: verifyLogin(fetchFunction, context),
      },
      trees: {
        private: {
          template: {
            getSingle: getTemplateSingle(fetchFunction, context),
            getCollection: getTemplateCollection(fetchFunction, context),
            create: {
              request: requestTemplateUpload(fetchFunction, context),
              upload: createTemplate(fetchFunction, context),
            },
            update: {
              request: requestTemplateUpload(fetchFunction, context),
              upload: updateTemplate(fetchFunction, context),
            },
            delete: deleteTemplateSingle(fetchFunction, context),
            getFileUrl: getTemplateFileUrlSingle(fetchFunction, context),
          },
          generateDocument: getPrivateDocument(fetchFunction, context),
          getSingle: getTree(fetchFunction, context),
          getCollection: getTrees(fetchFunction, context),
          create: createTree(fetchFunction, context),
          delete: deleteTree(fetchFunction, context),
          update: updateTree(fetchFunction, context),
          publish: createPublishedTreeOfTree(fetchFunction, context),
          getContent: getPrivateTreeContent(fetchFunction, context),
          unpublish: deletePublishedTree(fetchFunction, context),
        },
        shared: {
          getContent: getSharedTreeContent(fetchFunction, context),
          generateDocument: getSharedDocument(fetchFunction, context),
        },
        published: {
          getContent: getPublishedTreesOfTreeContent(fetchFunction, context),
          getSingle: getPublishedTree(fetchFunction, context),
          getCollection: getPublishedTrees(fetchFunction, context),
          generateDocument: getPublishedDocument(fetchFunction, context),
        },
      },
      user: {
        getUser: getUser(fetchFunction, context),
        updateUser: updateUser(fetchFunction, context),
        deleteUser: deleteUser(fetchFunction, context),
      },
    };
  };

export type TClient = ReturnType<ReturnType<typeof createAPIClient>>;
