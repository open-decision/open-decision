import create from "zustand";
import produce from "immer";
import { v4 as uuidV4 } from "uuid";

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

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: {},
  addNotification: (notification) =>
    set(
      produce((state: NotificationState) => {
        state.notifications[uuidV4()] = { duration: 5, ...notification };
      })
    ),
  removeNotification: (id) =>
    set(
      produce((state: NotificationState) => {
        delete state.notifications[id];
      })
    ),
}));
