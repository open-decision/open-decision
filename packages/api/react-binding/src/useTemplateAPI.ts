import { FetchResponse } from "@open-decision/api-helpers";
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
  UseQueryOptions,
} from "@tanstack/react-query";
import { APIClient, TClient } from "@open-decision/api-client";
import {
  NotificationTemplate,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { APIError } from "@open-decision/type-classes";

export type useCreateTemplateOptions = UseMutationOptions<
  FetchResponse<Response, TCreateTemplateOutput>,
  APIError,
  {
    template: File;
    treeUuid: string;
    displayName: string;
    templateUuid?: string;
  }
>;
export type useDeleteTemplateOptions = UseMutationOptions<
  FetchResponse<Response, TDeleteTemplateSingleOutput>,
  APIError,
  { templateUuid: string }
>;

export type useUpdateTemplateOptions = UseMutationOptions<
  FetchResponse<Response, TDeleteTemplateSingleOutput>,
  APIError,
  {
    templateUuid: string;
    template: File;
    treeUuid: string;
    displayName: string;
  }
>;

export type useTemplateQueryOptions = UseQueryOptions<
  FetchResponse<Response, TGetTemplateSingleOutput>,
  APIError,
  FetchResponse<Response, TGetTemplateSingleOutput>,
  ReturnType<typeof templateQueryKey>
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

export const useTemplateAPI = (client: TClient = APIClient) => {
  const queryClient = useQueryClient();
  const addNotificationFromTemplate = useNotificationTemplate();

  const useTemplateQuery = (
    templateUuid: string,
    options?: useTemplateQueryOptions
  ) => {
    return useQuery(
      templateQueryKey(templateUuid),
      () =>
        client.trees.private.template.getSingle({
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
        const token = await client.trees.private.template.create.request({
          body: { treeUuid, templateUuid },
        });

        return await client.trees.private.template.create.upload({
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
        return await client.trees.private.template.delete({
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
