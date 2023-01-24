import {
  TCreatePublishedTreeInput,
  TCreateTreeInput,
  TCreateTreeOutput,
  TDeletePublishedTreeInput,
  TDeleteTreeInput,
  TGetTreeOutput,
  TGetTreesOutput,
  TUpdateTreeInput,
  TCreatePublishedTreeOutput,
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
  UseQueryOptions,
} from "@tanstack/react-query";
import { Node, TreeClient } from "@open-decision/tree-type";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { PlaceholderNodePlugin } from "@open-decision/node-editor";
import { FetchResponse } from "@open-decision/api-helpers";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { APIClient, TClient } from "@open-decision/api-client";

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
  FetchResponse<Response, void>,
  APIError,
  TDeleteTreeInput
>;

export type useCreateOptions = UseMutationOptions<
  FetchResponse<Response, TCreateTreeOutput>,
  APIError,
  TCreateTreeInput
>;

export type useUpdateOptions = UseMutationOptions<
  FetchResponse<Response, void>,
  APIError,
  TUpdateTreeInput
>;

export type useArchiveOptions = UseMutationOptions<
  FetchResponse<Response, void>,
  APIError,
  Pick<TUpdateTreeInput, "params">
>;

export type usePublishOptions = UseMutationOptions<
  FetchResponse<Response, TCreatePublishedTreeOutput>,
  APIError,
  TCreatePublishedTreeInput
>;

export type useUnpublishOptions = UseMutationOptions<
  FetchResponse<Response, void>,
  APIError,
  TDeletePublishedTreeInput
>;

export type useTreesQueryOptions = UseQueryOptions<
  FetchResponse<Response, TGetTreesOutput>,
  APIError,
  TGetTreesOutput,
  typeof treesQueryKey
>;

export type useTreeQueryOptions = UseQueryOptions<
  FetchResponse<Response, TGetTreeOutput>,
  APIError,
  TGetTreeOutput,
  ReturnType<typeof treeQueryKey>
>;

export type useTreeDataQueryOptions = UseQueryOptions<
  FetchResponse<Response, TGetTreeDataOutput>,
  APIError,
  TGetTreeDataOutput,
  ReturnType<typeof treeDataQueryKey>
>;

export type useTreePreviewQueryOptions = UseQueryOptions<
  FetchResponse<Response, TGetTreePreviewOutput>,
  APIError,
  TGetTreePreviewOutput,
  ReturnType<typeof treeDataQueryKey>
>;

export type useExportOptions = UseMutationOptions<
  string,
  APIError,
  { name: string }
>;

export const useTreeAPI = (client: TClient = APIClient) => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();

  const useTreesQuery = (options?: useTreesQueryOptions) => {
    return useQuery(
      treesQueryKey,
      () => client.trees.private.getCollection({}),
      options
    );
  };

  const useTreeQuery = (uuid: string, options?: useTreeQueryOptions) =>
    useQuery(
      treeQueryKey(uuid),
      () => client.trees.private.getSingle({ params: { uuid } }),
      options
    );

  const useTreeData = (uuid: string, options?: useTreeDataQueryOptions) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => client.trees.private.getContent({ params: { uuid } }),
      options
    );
  };

  const useSharedTreeData = (
    uuid: string,
    options?: useTreePreviewQueryOptions
  ) => {
    return useQuery(
      treeDataQueryKey(uuid),
      () => client.trees.shared.getContent({ params: { uuid } }),
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
        const response = await client.trees.private.create(data);
        const yDoc = new Y.Doc();
        new IndexeddbPersistence(response.data.uuid, yDoc);

        const yMap = yDoc.getMap("tree");

        const treeClient = new TreeClient("", {
          nodes: {},
          pluginEntities: {},
          edges: {},
          startNode: "node_0",
        });

        const node = PlaceholderNode.create({
          position: { x: 0, y: 0 },
        })(treeClient);
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
        return client.trees.private.delete(data);
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "deleteProject");
          }

          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
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
        return client.trees.private.update(data);
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
        client.trees.private.update({
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
        client.trees.private.update({
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
    useMutation(["publishTree"], (data) => client.trees.private.publish(data), {
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
      retry: (failureCount, error) => {
        if (isAPIError(error) && error.code === "NO_TREE_DATA") {
          return false;
        }

        return failureCount < 3;
      },
    });

  const useUnPublish = ({
    notification,
    onSuccess,
    onSettled,
    ...options
  }: useUnpublishOptions & { notification?: NotificationTemplate } = {}) =>
    useMutation(
      ["unpublishTree"],
      (data) => {
        return client.trees.private.unpublish(data);
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
        const { data: treeData } = await client.trees.private.getContent({
          params: { uuid },
        });

        return new Promise<string>((resolve) => {
          return setTimeout(() => {
            const file = createFile({
              name: data?.name,
              treeData,
            });

            return resolve(URL.createObjectURL(file));
          }, 1000);
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
    useTreePreview: useSharedTreeData,
  };
};
