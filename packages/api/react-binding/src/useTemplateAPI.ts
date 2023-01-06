import { FetchJSONReturn } from "@open-decision/api-helpers";
import {
  TCreateTemplateOutput,
  TDeleteTemplateSingleOutput,
  TGetTemplateSingleOutput,
} from "@open-decision/api-specification";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { proxiedClient, directClient } from "@open-decision/api-client";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { APIError } from "@open-decision/type-classes";

export type useCreateTemplateOptions = UseMutationOptions<
  FetchJSONReturn<TCreateTemplateOutput>,
  APIError<void>,
  {
    template: File;
    treeUuid: string;
    displayName: string;
    templateUuid?: string;
  }
>;
export type useDeleteTemplateOptions = UseMutationOptions<
  FetchJSONReturn<TDeleteTemplateSingleOutput>,
  APIError<void>,
  { templateUuid: string }
>;

export type useUpdateTemplateOptions = UseMutationOptions<
  FetchJSONReturn<TDeleteTemplateSingleOutput>,
  APIError<void>,
  {
    templateUuid: string;
    template: File;
    treeUuid: string;
    displayName: string;
  }
>;

export const templateQueryKeys = ["Templates"] as const;

export const templateQueryKey = (uuid: string) =>
  [...templateQueryKeys, uuid] as const;

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
    templateUuid: string,
    options?: {
      staleTime?: number;
      select?: (data: FetchJSONReturn<TGetTemplateSingleOutput>) => TData;
    }
  ) => {
    return useQuery(
      templateQueryKey(templateUuid),
      () =>
        proxiedClient("client").file.template.getSingle({
          params: { uuid: templateUuid },
        }),
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
      async ({ template, treeUuid, displayName, templateUuid }) => {
        const token = await proxiedClient(
          "client"
        ).file.template.create.request({
          body: { treeUuid, templateUuid },
        });

        return await directClient("client").file.template.create.upload({
          body: {
            template,
            displayName,
          },
          query: {
            token: token.data.token,
          },
        });
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "addTemplate");
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

  const useDeleteTemplateMutation = ({
    onSuccess,
    onSettled,
    notification,
    ...options
  }: useDeleteTemplateOptions & {
    notification?: NotificationTemplate;
  } = {}) => {
    return useMutation(
      ["deleteTemplate"],
      async ({ templateUuid }) => {
        return await proxiedClient("client").file.template.delete({
          params: { uuid: templateUuid },
        });
      },
      {
        ...options,
        onSuccess: (...params) => {
          if (notification !== false) {
            addNotificationFromTemplate(notification ?? "deleteTemplate");
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
    useDeleteTemplateMutation,
  };
};
