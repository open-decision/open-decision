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
import { APIError, ODError, Tree } from "@open-decision/type-classes";
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
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useNotificationStore } from "../../config/notifications";
import { createYjsDocumentIndexedDB } from "./utils/createYjsDocumentIndexedDB";

export const treesQueryKey = ["Trees"] as const;
export const treeQueryKey = (treeUuid: string) =>
  ["Tree", ...treesQueryKey, treeUuid] as const;

export const useTreeAPI = () => {
  const t = useTranslations("common");
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const useTreesQuery = <TData = FetchReturn<TGetTreesOutput>>(options?: {
    select?: (data: FetchReturn<TGetTreesOutput>) => TData;
  }) => {
    return useQuery(treesQueryKey, () => proxiedOD.trees.getCollection({}), {
      staleTime: 5000,
      ...options,
    });
  };

  const useTreeQuery = <TData = FetchReturn<TGetTreeOutput>>(
    uuid: string,
    options?: { select?: (data: FetchReturn<TGetTreeOutput>) => TData }
  ) =>
    useQuery(
      treeQueryKey(uuid),
      () => {
        return proxiedOD.trees.getSingle({ params: { uuid } });
      },
      {
        staleTime: 5000,
        ...options,
      }
    );

  const useCreate = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useCreateOptions & { notification?: notification } = {}) => {
    return useMutation(
      ["createTree"],
      async (data) => {
        const response = await proxiedOD.trees.create(data);

        const newInput = Tree.createInput();
        const newAnswer = Tree.createAnswer({ text: "" });

        const newNode = Tree.createNode({
          data: { inputs: [newInput.id], conditions: [] },
        });

        const store = createYjsDocumentIndexedDB({}, response.data.uuid);

        Tree.addNode(store)(newNode);
        Tree.addInput(store)(newInput);
        Tree.addInputAnswer(store)(newInput.id, newAnswer);

        return response;
      },
      {
      ...options,
      onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "createProject")
            : null;
          return onSuccess?.(...params);
      },
        onSettled: (...params) => {
          invalidateTrees();
          return onSettled?.(...params);
        },
      }
    );
  };

  const useDelete = (
    options?: UseMutationOptions<unknown, APIError<void>, TDeleteTreeInput>
  ) =>
    useMutation(["deleteTree"], (data) => proxiedOD.trees.delete(data), {
      ...options,
      onSuccess: async (...params) => {
        addNotification({
          title: t("deleteTreeDialog.successNotification"),
          variant: "success",
        });
        options?.onSuccess?.(...params);
        return queryClient.invalidateQueries(treesQueryKey);
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
          title: t("updateTreeDialog.successNotification"),
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
            title: t("successNotifications.unarchived"),
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
            title: t("successNotifications.archived"),
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
            title: t("successNotifications.published"),
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
            title: t("successNotifications.unpublished"),
            variant: "success",
          });
        },
      }
    );

  const TreeImportType = Tree.Type.extend({ name: z.string() });

  const useImport = (
    options?: UseMutationOptions<
      unknown,
      APIError<void>,
      { event: ProgressEvent<FileReader> }
    >
  ) =>
    useMutation(
      ["importTree"],
      ({ event }) => {
        try {
          const result = event.target?.result;

          if (!result || !(typeof result === "string")) throw result;
          const parsedResult = JSON.parse(result);
          const validatedResult = TreeImportType.safeParse(parsedResult);

          if (!validatedResult.success) throw validatedResult;
          const { name, ..._ } = validatedResult.data;

          return proxiedOD.trees.create({ body: { name } });
        } catch (error) {
          throw new ODError({
            code: "IMPORT_INVALID_FILE",
            message: "The provided file is invalid.",
          });
        }
      },
      {
        ...options,
        onSuccess: (...params) => {
          const yDoc = new Y.Doc();
          const yMap = yDoc.getMap("tree");
          new IndexeddbPersistence(params[0].data.uuid, yDoc);
          const importStore = proxy(params[0].data);
          bindProxyAndYMap(importStore, yMap);

          queryClient.invalidateQueries(treesQueryKey);
          addNotification({
            title: t("successNotifications.import"),
            variant: "success",
          });
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

          return setTimeout(() => {
            addNotification({
              title: t("successNotifications.export"),
              variant: "success",
            });
            return resolve(createFile({ name: data?.name, ...tree }));
          }, 2000);
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
