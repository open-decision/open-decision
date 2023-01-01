import { proxiedClient } from "@open-decision/api-client";
import { FetchJSONReturn } from "@open-decision/api-helpers";
import { invalidateTrees } from "@open-decision/api-react-binding";
import { TCreateTreeOutput } from "@open-decision/api-specification";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { createTreeClientWithPlugins } from "@open-decision/tree-client";
import { APIError, ODError } from "@open-decision/type-classes";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { createYjsDocumentIndexedDB } from "./utils/createYjsDocumentIndexedDB";

export type useImportOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTreeOutput>,
  APIError<void>,
  { event: ProgressEvent<FileReader> }
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
        const result = event.target?.result;

        if (!result || !(typeof result === "string")) throw result;
        const parsedResult = JSON.parse(result);

        const TreeImportType = z.object({
          name: z.string(),
          treeData: createTreeClientWithPlugins(parsedResult["treeData"])
            .treeClient.Type,
        });

        const validatedResult = TreeImportType.safeParse(parsedResult);
        if (!validatedResult.success) {
          console.error(validatedResult.error);
          throw validatedResult;
        }

        const data = validatedResult.data;

        const response = await proxiedClient.trees.create({
          body: { name: data.name },
        });

        createYjsDocumentIndexedDB(data.treeData, response.data.uuid);

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
