import * as React from "react";
import { v4 as uuidV4 } from "uuid";
import { proxy } from "valtio";

export type notificationVariants = "success" | "danger" | "info" | "warning";

export type Notification = {
  variant?: notificationVariants;
  title: React.ReactNode;
  content?: React.ReactNode;
  duration?: number;
};

export const notificationState = proxy({
  notifications: {} as Record<string, Notification>,
  addNotification: (notification: Omit<Notification, "id">) => {
    notificationState.notifications[uuidV4()] = {
      duration: 5,
      variant: "info",
      ...notification,
    };
  },
  removeNotification: (id: string) => {
    delete notificationState.notifications[id];
  },
});

export type NotificationState = typeof notificationState;
