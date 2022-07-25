import { isAPIError } from "@open-decision/type-classes";
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";
import { useNotificationStore } from "../Notifications/NotificationState";

export function useQueryClient() {
  const router = useRouter();
  const { addNotification } = useNotificationStore();

  return React.useMemo(
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
              // If we get an unauthenticated API error we want to show a notification and
              // redirect the user to the login page.
              if (isAPIError(error) && error.code === "UNAUTHENTICATED") {
                router.push("/auth/login");
                addNotification({
                  title: "Du bist nicht angemeldet",
                  content: "Bitte melde dich an, um fortzufahren.",
                  variant: "danger",
                });
              }
            },
          },
          mutations: {},
        },
      }),
    [addNotification, router]
  );
}
