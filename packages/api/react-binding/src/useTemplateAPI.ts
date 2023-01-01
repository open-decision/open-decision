import { FetchJSONReturn } from "@open-decision/api-helpers";
import {
  TCreateTemplateOutput,
  TGetTemplateSingleOutput,
} from "@open-decision/api-specification";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { proxiedClient } from "@open-decision/api-client";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { APIError } from "@open-decision/type-classes";

export type useCreateTemplateOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTemplateOutput>,
  APIError<void>,
  { template: File; treeUuid: string; displayName: string }
>;

export const templateQueryKeys = ["Templates"] as const;

export const templateQueryKey = (uuid: string) => ["Template", uuid] as const;

export const invalidateTemplates =
  (queryClient: QueryClient) => (uuid?: string) => {
    if (uuid) {
      queryClient.invalidateQueries(templateQueryKey(uuid));
    }

    queryClient.invalidateQueries(templateQueryKeys);
  };

export const useTemplateAPI = () => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();

  const useTemplateQuery = <TData = FetchJSONReturn<TGetTemplateSingleOutput>>(
    uuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<TGetTemplateSingleOutput>) => TData;
    }
  ) => {
    return useQuery(
      templateQueryKey(uuid),
      () => proxiedClient.file.template.getSingle({ params: { uuid } }),
      options
    );
  };

  const useCreateTemplateMutation = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useCreateTemplateOptions & {
    notification?: NotificationTemplate;
  } = {}) => {
    return useMutation(
      ["createTemplate"],
      async ({ template, treeUuid, displayName }) => {
        try {
          return await proxiedClient.file.template.create({
            body: { template, displayName, treeUuid },
          });
        } catch (error) {
          console.error(error);
          // Unhandled error
          throw new Error();
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
          invalidateTemplates(queryClient)();
          return onSettled?.(...params);
        },
      }
    );
  };

  return {
    useTemplateQuery,
    useCreateTemplateMutation,
  };
};
