import { FetchReturn } from "@open-decision/api-helpers";
import {
  TCreatePublishedTreeInput,
  TCreateTreeInput,
  TCreateTreeOutput,
  TDeletePublishedTreeInput,
  TDeleteTreeInput,
  TGetTreeOutput,
  TGetTreesOutput,
  TUpdateTreeInput,
} from "@open-decision/tree-api-specification";
import { APIError, Tree } from "@open-decision/type-classes";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import { proxiedOD } from "../Data/odClient";
import { useNotificationStore } from "../Notifications/NotificationState";
import { useTreeContext } from "../Builder/state/treeStore/TreeContext";

export const treesQueryKey = ["Trees"] as const;
export const treeQueryKey = (treeUuid: string) =>
  ["Tree", ...treesQueryKey, treeUuid] as const;

export const useTreeAPI = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const useTreesQuery = <TData = FetchReturn<TGetTreesOutput>>(options?: {
    select?: (data: FetchReturn<TGetTreesOutput>) => TData;
  }) => {
    return useQuery(treesQueryKey, () => proxiedOD.trees.getCollection({}), {
      ...options,
      suspense: true,
    });
  };

  const useTreeQuery = <TData = FetchReturn<TGetTreeOutput>>(
    uuid: string,
    options?: { select?: (data: FetchReturn<TGetTreeOutput>) => TData }
  ) =>
    useQuery(
      treeQueryKey(uuid),
      () => proxiedOD.trees.getSingle({ params: { uuid } }),
      {
        suspense: true,
        ...options,
      }
    );

  const useCreate = (
    options?: UseMutationOptions<
      unknown,
      APIError<TCreateTreeOutput>,
      TCreateTreeInput
    >
  ) =>
    useMutation(["createTree"], (data) => proxiedOD.trees.create(data), {
      ...options,
      onSuccess: (...params) => {
        options?.onSuccess?.(...params);
        queryClient.invalidateQueries(treesQueryKey);
        addNotification({
          title: "Baum erfolgreich erstellt",
          variant: "success",
        });
      },
    });

  const useDelete = (
    options?: UseMutationOptions<unknown, APIError<void>, TDeleteTreeInput>
  ) =>
    useMutation(["deleteTree"], (data) => proxiedOD.trees.delete(data), {
      ...options,
      onSuccess: (...params) => {
        options?.onSuccess?.(...params);
        queryClient.invalidateQueries(treesQueryKey);
        addNotification({
          title: "Baum erfolgreich gelöscht",
          variant: "success",
        });
      },
    });

  const useUpdate = (
    options?: UseMutationOptions<unknown, APIError<void>, TUpdateTreeInput>
  ) =>
    useMutation(["updateTree"], (data) => proxiedOD.trees.update(data), {
      ...options,
      onSuccess: (...params) => {
        options?.onSuccess?.(...params);
        queryClient.invalidateQueries(treeQueryKey(params[1].params.uuid));
        queryClient.invalidateQueries(treesQueryKey);
        addNotification({
          title: "Baum erfolgreich aktualisiert",
          variant: "success",
        });
      },
    });

  const useUnArchive = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      TUpdateTreeInput["params"]
    >
  ) =>
    useMutation(
      ["unarchiveTree"],
      ({ uuid }) =>
        proxiedOD.trees.update({
          body: { status: "ACTIVE" },
          params: { uuid },
        }),
      {
        ...options,
        onSuccess: (...params) => {
          options?.onSuccess?.(...params);
          queryClient.invalidateQueries(treesQueryKey);
          addNotification({
            title: "Baum erfolgreich unarchiviert",
            variant: "success",
          });
        },
      }
    );

  const useArchive = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      TUpdateTreeInput["params"]
    >
  ) =>
    useMutation(
      ["archiveTree"],
      ({ uuid }) =>
        proxiedOD.trees.update({
          body: { status: "ARCHIVED" },
          params: { uuid },
        }),
      {
        ...options,
        onSuccess: (...params) => {
          options?.onSuccess?.(...params);
          queryClient.invalidateQueries(treesQueryKey);
          addNotification({
            title: "Baum erfolgreich archiviert",
            variant: "success",
          });
        },
      }
    );

  const usePublish = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      TCreatePublishedTreeInput
    >
  ) =>
    useMutation(
      ["publishTree"],
      (data) => proxiedOD.trees.publishedTrees.create(data),
      {
        ...options,
        onSuccess: (...params) => {
          options?.onSuccess?.(...params);
          queryClient.invalidateQueries(treesQueryKey);
          addNotification({
            title: "Baum erfolgreich veröffentlicht",
            variant: "success",
          });
        },
      }
    );

  const useUnPublish = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      TDeletePublishedTreeInput
    >
  ) =>
    useMutation(
      ["unpublishTree"],
      (data) => {
        return proxiedOD.publishedTrees.delete(data);
      },
      {
        ...options,
        onSuccess: (...params) => {
          options?.onSuccess?.(...params);
          queryClient.invalidateQueries(treesQueryKey);
          addNotification({
            title: "Baum erfolgreich unveröffentlicht",
            variant: "success",
          });
        },
      }
    );

  const useImport = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      { name: string; data: Tree.TTree }
    >
  ) =>
    useMutation(
      ["importTree"],
      ({ name, ..._ }) => proxiedOD.trees.create({ body: { name } }),
      {
        ...options,
        onSuccess: (...params) => {
          if (!params[0].data) return;

          const yDoc = new Y.Doc();
          const yMap = yDoc.getMap("tree");
          new IndexeddbPersistence(params[0].data.uuid, yDoc);
          const importStore = proxy(params[0].data);
          bindProxyAndYMap(importStore, yMap);

          queryClient.invalidateQueries(treesQueryKey);
          return options?.onSuccess?.(...params);
        },
      }
    );

  const useExport = (
    options?: UseMutationOptions<unknown, APIError<void>, { name: string }>
  ) => {
    const { getTree } = useTreeContext();

    function createFile(data: object) {
      return new Blob([JSON.stringify(data)], { type: "application/json" });
    }

    return useMutation(
      ["exportTree"],
      (data) => {
        return new Promise<Blob>((resolve) => {
          const tree = getTree();

          return setTimeout(
            () => resolve(createFile({ name: data?.name, ...tree })),
            2000
          );
        });
      },
      options
    );
  };

  return {
    treesQueryKey,
    treeQueryKey,
    useTreesQuery,
    useTreeQuery,
    useDelete,
    useCreate,
    useUpdate,
    useArchive,
    useUnArchive,
    usePublish,
    useUnPublish,
    useImport,
    useExport,
  };
};
