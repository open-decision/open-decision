import { QueryClient } from "react-query";
import { APIError } from "@open-decision/type-classes";
import { notificationState } from "../Notifications/NotificationState";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
    mutations: {
      onError(error) {
        if (error instanceof APIError) {
          notificationState.addNotification({
            title: error.code,
            content: error.message,
            variant: "danger",
          });
        }
      },
    },
  },
});
