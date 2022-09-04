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

  const useImport = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useImportOptions & { notification?: notification } = {}) =>
    useMutation(
      ["importTree"],
      async ({ event }) => {
        try {
          const result = event.target?.result;

          if (!result || !(typeof result === "string")) throw result;
          const parsedResult = JSON.parse(result);
          const validatedResult = TreeImportType.safeParse(parsedResult);
          if (!validatedResult.success) throw validatedResult;
          const data = validatedResult.data;

          const response = await proxiedOD.trees.create({
            body: { name: data.name },
          });

          createYjsDocumentIndexedDB(data, response.data.uuid);

          queryClient.invalidateQueries(treesQueryKey);
          return response;
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
          notification !== false
            ? addNotificationFromTemplate(notification ?? "import")
            : null;
          return onSuccess?.(...params);
        },
        onSettled: (...params) => {
          invalidateTrees();
          return onSettled?.(...params);
        },
      }
    );

  const useExport = (
    uuid: string,
    {
      notification,
      onSuccess,
      ...options
    }: useExportOptions & { notification?: notification } = {}
  ) => {
    const { data: tree } = useTreeData(uuid);

    function createFile(data: object, name: string) {
      return new File([JSON.stringify(data)], name, {
        type: "application/json",
      });
    }

    return useMutation(
      ["exportTree"],
      (data) => {
        return new Promise<{ fileUrl: string; file: File }>((resolve) => {
          return setTimeout(() => {
            const file = createFile(
              { name: data?.name, ...tree?.data },
              data.fileName
            );

            return resolve({ fileUrl: URL.createObjectURL(file), file });
          }, 2000);
        });
      },
      {
        ...options,
        onSuccess: (...params) => {
          notification !== false
            ? addNotificationFromTemplate(notification ?? "export")
            : null;
          return onSuccess?.(...params);
        },
      }
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
