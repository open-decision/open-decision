import * as React from "react";
import { useRouter } from "next/router";
import { useNotificationStore } from "./NotificationState";
import { notificationTemplates } from "./NotificationTemplates";

export function useUrlNotification() {
  const {
    query: { notify },
  } = useRouter();
  const { addNotification } = useNotificationStore();

  React.useEffect(() => {
    if (notify && typeof notify === "string") {
      addNotification(notificationTemplates[notify]);
    }
  }, [notify, addNotification]);
}
