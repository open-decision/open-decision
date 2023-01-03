import {
  TCreatePublishedTreeInput,
  TCreateTreeInput,
  TCreateTreeOutput,
  TDeletePublishedTreeInput,
  TDeleteTreeInput,
  TGetTreeOutput,
  TGetTreesOutput,
  TUpdateTreeInput,
  TDeleteTreeOutput,
  TUpdateTreeOutput,
  TCreatePublishedTreeOutput,
  TDeletePublishedTreeOutput,
  TGetTreeDataOutput,
  TGetTreePreviewOutput,
} from "@open-decision/api-specification";
import { APIError, isAPIError } from "@open-decision/type-classes";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Node, Tree, TreeClient } from "@open-decision/tree-type";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { PlaceholderNodePlugin } from "@open-decision/node-editor";
import { FetchJSONReturn } from "@open-decision/api-helpers";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { directClient, proxiedClient } from "@open-decision/api-client";

const PlaceholderNode = new PlaceholderNodePlugin();

export const treesQueryKey = ["Trees"] as const;
export const treeQueryKey = (treeUuid: string) =>
  [...treesQueryKey, treeUuid] as const;

export const treeDataQueryKey = (treeUuid: string) =>
  [treeUuid, "TreeData"] as const;

export const invalidateTrees =
  (queryClient: QueryClient) => (uuid?: string) => {
    if (uuid) {
      queryClient.invalidateQueries(treeQueryKey(uuid));
    }

    queryClient.invalidateQueries(treesQueryKey);
  };

export type useDeleteOptions = UseMutationOptions<
  FetchJSONReturn<TDeleteTreeOutput>,
  APIError<void>,
  TDeleteTreeInput
>;

export type useCreateOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTreeOutput>,
  APIError<TCreateTreeOutput>,
  TCreateTreeInput
>;

export type useUpdateOptions = UseMutationOptions<
  FetchJSONReturn<TUpdateTreeOutput>,
  APIError<void>,
  TUpdateTreeInput
>;

export type useArchiveOptions = UseMutationOptions<
  FetchJSONReturn<TUpdateTreeOutput>,
  APIError<void>,
  Pick<TUpdateTreeInput, "params">
>;

export type usePublishOptions = UseMutationOptions<
  FetchJSONReturn<TCreatePublishedTreeOutput>,
  APIError<void>,
  TCreatePublishedTreeInput
>;

export type useUnpublishOptions = UseMutationOptions<
  FetchJSONReturn<TDeletePublishedTreeOutput>,
  APIError<void>,
  TDeletePublishedTreeInput
>;

export type useExportOptions = UseMutationOptions<
  string,
  APIError<void>,
  { name: string }
>;

export const useTreeAPI = () => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();

  const useTreesQuery = <TData = FetchJSONReturn<TGetTreesOutput>>(options?: {
    staleTime?: number;
    select?: (data: FetchJSONReturn<TGetTreesOutput>) => TData;
  }) => {
    return useQuery(
      treesQueryKey,
      () => proxiedClient.trees.getCollection({}),
      options
    );
  };

  const useTreeQuery = <TData = FetchJSONReturn<TGetTreeOutput>>(
    uuid: string,
    options?: {
      select?: (data: FetchJSONReturn<TGetTreeOutput>) => TData;
      staleTime?: number;
      enabled?: boolean;
      initialData?: FetchJSONReturn<TGetTreeOutput>;
      onSuccess?: (data: TData) => void;
    }
  ) =>
    useQuery(
      treeQueryKey(uuid),
      () => proxiedClient.trees.getSingle({ params: { uuid } }),
      options
    );

  const useTreeData = <TData = FetchJSONReturn<TGetTreeDataOutput>>(
    uuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<Tree.TTree>) => TData;
      enabled?: boolean;
    }
  ) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => directClient.trees.data.get({ params: { uuid } }),
      options
    );
  };

  const useTreePreview = <TData = FetchJSONReturn<TGetTreePreviewOutput>>(
    uuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<Tree.TTree>) => TData;
      enabled?: boolean;
    }
  ) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => directClient.trees.data.getPreview({ params: { uuid } }),
      {
        ...options,
        retry: (failureCount, error) => {
          if (isAPIError(error) && error.code === "PREVIEW_NOT_ENABLED") {
            return false;
          }
          return failureCount < 3;
        },
      }
    );
  };

  const useCreate = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useCreateOptions & { notification?: NotificationTemplate } = {}) => {
    return useMutation(
      ["createTree"],
      async (data) => {
        const response = await proxiedClient.trees.create(data);
        const yDoc = new Y.Doc();
        new IndexeddbPersistence(response.data.uuid, yDoc);

        const yMap = yDoc.getMap("tree");

        const treeClient = new TreeClient({
          nodes: {},
          pluginEntities: {},
          edges: {},
          startNode: "",
          uuid: "",
        });

        const node = PlaceholderNode.create({})(treeClient);
        const yNode = new Y.Map<Node.TRecord>([[node.id, node]]);

        yMap.set("startNode", node.id);
        yMap.set("nodes", yNode);
        yMap.set("edges", new Y.Map());
        yMap.set("pluginEntities", new Y.Map());

        return response;
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "createProject");
          }
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(queryClient)();
          return onSettled?.(...params);
        },
      }
    );
  };

  const useDelete = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useDeleteOptions & {
    notification?: NotificationTemplate;
  } = {}) =>
    useMutation(
      ["deleteTree"],
      async (data) => {
        return proxiedClient.trees.delete(data);
      },
      {
        ...options,
        onSuccess: async (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "deleteProject");
          }

          return onSuccess?.(...params);
        },
        onSettled: async (...params) => {
          invalidateTrees(queryClient)();
          return onSettled?.(...params);
        },
      }
    );

  const useUpdate = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useUpdateOptions & {
    notification?: NotificationTemplate;
  } = {}) =>
    useMutation(
      ["updateTree"],
      (data) => {
        return proxiedClient.trees.update(data);
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "updateProject");
          }

          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          console.log(params[2]);
          invalidateTrees(queryClient)(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const useUnArchive = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useArchiveOptions & { notification?: NotificationTemplate } = {}) =>
    useMutation(
      ["unarchiveTree"],
      ({ params }) =>
        proxiedClient.trees.update({
          body: { status: "ACTIVE" },
          params,
        }),
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "unarchived");
          }
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(queryClient)(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const useArchive = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useArchiveOptions & { notification?: NotificationTemplate } = {}) =>
    useMutation(
      ["archiveTree"],
      ({ params }) =>
        proxiedClient.trees.update({
          body: { status: "ARCHIVED" },
          params,
        }),
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "archived");
          }

          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(queryClient)(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  const usePublish = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: usePublishOptions & { notification?: NotificationTemplate } = {}) =>
    useMutation(
      ["publishTree"],
      (data) => proxiedClient.trees.publishedTrees.create(data),
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "published");
          }

          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(queryClient)(params[2].params.treeUuid);
          return onSettled;
        },
      }
    );

  const useUnPublish = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useUnpublishOptions & { notification?: NotificationTemplate } = {}) =>
    useMutation(
      ["unpublishTree"],
      (data) => {
        return proxiedClient.publishedTrees.delete(data);
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "unpublished");
          }

          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees(queryClient)(params[2].params.uuid);
          return onSettled?.(...params);
        },
      }
    );

  function createFile(data: object) {
    return new Blob([JSON.stringify(data)], { type: "application/json" });
  }

  const useExport = (
    uuid: string,
    {
      onSuccess,
      ...options
    }: useExportOptions & { notification?: NotificationTemplate } = {}
  ) => {
    return useMutation(
      ["exportTree"],
      async (data) => {
        const { data: treeData } = await proxiedClient.trees.data.get({
          params: { uuid },
        });

        return new Promise<string>((resolve) => {
          return setTimeout(() => {
            const file = createFile({
              name: data?.name,
              treeData,
            });

            return resolve(URL.createObjectURL(file));
          }, 2000);
        });
      },
      {
        ...options,
        onSuccess: (...params) => {
          return onSuccess?.(...params);
        },
      }
    );
  };

  return {
    treesQueryKey,
    treeQueryKey,
    treeDataQueryKey,
    useTreesQuery,
    useTreeQuery,
    useTreeData,
    useDelete,
    useCreate,
    useUpdate,
    useArchive,
    useUnArchive,
    usePublish,
    useUnPublish,
    useExport,
    useTreePreview,
  };
};
