import { APIClient } from "@open-decision/api-client";
import { FetchResponse } from "@open-decision/api-helpers";
import { invalidateTrees } from "@open-decision/api-react-binding";
import { TCreateTreeOutput } from "@open-decision/api-specification";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";
import { useTreeClient } from "@open-decision/tree-sync";
import { isODError, ODError } from "@open-decision/type-classes";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { createYjsDocumentIndexedDB } from "../Data/utils/createYjsDocumentIndexedDB";

const getTreeFromImport = (event: ProgressEvent<FileReader>) => {
  const result = event.target?.result;

  if (!result || !(typeof result === "string")) throw result;
  const parsedResult = JSON.parse(result);

  const TreeImportType = z.object({
    name: z.string(),
    treeData: createTreeClientWithPlugins("", parsedResult["treeData"])
      .treeClient.Type,
  });

  const validatedResult = TreeImportType.safeParse(parsedResult);

  if (!validatedResult.success) {
    console.error(validatedResult.error);
    throw validatedResult;
  }

  return validatedResult.data;
};

export type useImportOptions = UseMutationOptions<
  FetchResponse<Response, TCreateTreeOutput>,
  ODError,
  { event: ProgressEvent<FileReader> }
>;

export type useOverwriteImportOptions = UseMutationOptions<
  void,
  ODError,
  { event: ProgressEvent<FileReader>; uuid: string }
>;

export const useImport = ({
  onSuccess,
  onSettled,
  notification,
  ...options
}: useImportOptions & { notification?: NotificationTemplate } = {}) => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();

  return useMutation(
    ["importTree"],
    async ({ event }) => {
      try {
        const data = getTreeFromImport(event);

        const response = await APIClient.trees.private.create({
          body: { name: data.name },
        });

        createYjsDocumentIndexedDB(data.treeData, response.data.uuid);

        return response;
      } catch (error) {
        console.error(error);
        throw new ODError({
          code: "IMPORT_INVALID_FILE",
          message: "The provided file is invalid.",
        });
      }
    },
    {
      ...options,
      retry: (failureCount, error) => {
        if (isODError(error) && error.code === "IMPORT_INVALID_FILE") {
          return false;
        }

        return failureCount < 3;
      },
      onSuccess: (...params) => {
        if (notification !== false) {
          addNotificationFromTemplate(notification ?? "import");
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

export const useOverwriteImport = ({
  onSuccess,
  onSettled,
  notification,
  ...options
}: useOverwriteImportOptions & {
  notification?: NotificationTemplate;
} = {}) => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();
  const treeClient = useTreeClient();

  return useMutation(
    ["overwriteTree"],
    async ({ event }) => {
      try {
        const data = getTreeFromImport(event);
        treeClient.updateTree(data.treeData as any);
      } catch (error) {
        console.error(error);
        throw new ODError({
          code: "IMPORT_INVALID_FILE",
          message: "The provided file is invalid.",
        });
      }
    },
    {
      ...options,
      onSuccess: (...params) => {
        if (notification !== false) {
          addNotificationFromTemplate(notification ?? "import");
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
