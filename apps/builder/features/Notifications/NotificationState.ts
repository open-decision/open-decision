import { v4 as uuidV4 } from "uuid";
import { proxy, useSnapshot } from "valtio";

export type notificationVariants = "success" | "danger" | "info" | "warning";

export type Notification = {
  variant: notificationVariants;
  title: React.ReactNode;
  content: React.ReactNode;
  duration?: number | "persistent";
};

export type NotificationState = {
  notifications: Record<string, Notification>;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
};

export const notificationState = proxy<NotificationState>({
  notifications: {},
  addNotification: (notification) => {
    notificationState.notifications[uuidV4()] = {
      duration: 5,
      ...notification,
    };
  },
  removeNotification: (id) => {
    delete notificationState.notifications[id];
  },
});

export const useNotificationStore = () => {
  return useSnapshot(notificationState);
};
