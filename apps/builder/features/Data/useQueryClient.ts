import { isAPIError, isODError } from "@open-decision/type-classes";
import { QueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import * as React from "react";
import { useNotificationStore } from "../../config/notifications";

export function useQueryClient() {
  const t = useTranslations("common.errors");
  const router = useRouter();
  const { addNotification } = useNotificationStore();

  const [state] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            useErrorBoundary: (_, query) => {
              // When we already have data we assume a background query failed. This should
              // not be thrown but handled in the respective component by default.
              return !query.state.data;
            },
            onError(error) {
              if (!isAPIError(error)) {
                return addNotification({
                  title: t("UNEXPECTED_ERROR.short"),
                  content: t("UNEXPECTED_ERROR.long"),
                  variant: "danger",
                });
              }
              // If we get an unauthenticated API error we want to show a notification and
              // redirect the user to the login page.
              if (error.code === "UNAUTHENTICATED") {
                typeof window != "undefined"
                  ? router.push("/auth/login")
                  : null;
                return addNotification({
                  title: t("UNAUTHENTICATED.short"),
                  content: t("UNAUTHENTICATED.long"),
                  variant: "danger",
                });
              }
            },
          },
          mutations: {
            onError(error) {
              console.log(error);
              if (!isODError(error)) {
                return addNotification({
                  title: t("UNEXPECTED_ERROR.short"),
                  content: t("UNEXPECTED_ERROR.long"),
                  variant: "danger",
                });
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
