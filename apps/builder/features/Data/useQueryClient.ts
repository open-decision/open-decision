import {
  addNotification,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { isAPIError, isODError } from "@open-decision/type-classes";
import { QueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as React from "react";

export function useQueryClient() {
  const t = useTranslations("common.errors");
  const addNotificationFromTemplate = useNotificationTemplate();

  const [state] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (isAPIError(error) && error.code === "UNAUTHENTICATED") {
                console.log(error);

                return false;
              }

              return failureCount < 3;
            },
            useErrorBoundary: (_, query) => {
              // When we already have data we assume a background query failed. This should
              // not be thrown but handled in the respective component by default.
              return !query.state.data;
            },
            onError(error) {
              console.error(error);

              if (!isAPIError(error)) {
                return addNotification({
                  title: t("UNEXPECTED_ERROR.short"),
                  content: t("UNEXPECTED_ERROR.long"),
                  variant: "danger",
                });
              }
              // If we get an unauthenticated API error we want to show a notification.
              if (error.code === "UNAUTHENTICATED") {
                addNotificationFromTemplate("loginExpired");
              }
            },
          },
          mutations: {
            retry: (failureCount, error) => {
              console.log(error);
              if (isAPIError(error) && error.code === "UNAUTHENTICATED") {
                return false;
              }

              return failureCount < 3;
            },
            onError(error) {
              console.error("queryClient", error);

              if (!isODError(error)) {
                return addNotification({
                  title: t("UNEXPECTED_ERROR.short"),
                  content: t("UNEXPECTED_ERROR.long"),
                  variant: "danger",
                });
              }

              // If we get an unauthenticated API error we want to show a notification
              if (error.code === "UNAUTHENTICATED") {
                addNotificationFromTemplate("loginExpired");
              }

              return addNotification({
                title: t(`${error.code}.short`),
                content: t(`${error.code}.long`),
                variant: "danger",
              });
            },
          },
        },
      })
  );

  return state;
}
