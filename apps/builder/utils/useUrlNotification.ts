import * as React from "react";
import { useRouter } from "next/router";
import { useNotificationStore } from "../config/notifications";

export function useUrlNotification() {
  const {
    query: { notify },
  } = useRouter();
  const { addNotification } = useNotificationStore();

  React.useEffect(() => {
    if (notify && typeof notify === "string") {
      addNotification(notify as any);
    }
  }, [notify, addNotification]);
}
