import create from "zustand";
import produce from "immer";
import { v4 as uuidV4 } from "uuid";

export type notificationVariants = "success" | "error" | "info" | "warning";

export type notification = {
  variant: notificationVariants;
  title: string;
  content: string;
  duration?: number;
};

export type NotificationState = {
  notifications: Record<string, notification>;
  addNotification: (notification: Omit<notification, "id">) => void;
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
