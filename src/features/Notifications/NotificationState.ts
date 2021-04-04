import create from "zustand";
import produce from "immer";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid/non-secure";

export type notificationVariants = "success" | "danger" | "neutral" | "warning";

export type notification = {
  variant: notificationVariants;
  title: string;
  content: string;
  duration: number;
};

export type NotificationState = {
  notifications: Record<string, notification>;
  addNotification: (notification: Omit<notification, "id">) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>(
  devtools((set) => ({
    notifications: {},
    addNotification: (notification) =>
      set(
        produce((state: NotificationState) => {
          state.notifications[nanoid(5)] = notification;
        })
      ),
    removeNotification: (id) =>
      set(
        produce((state: NotificationState) => {
          delete state.notifications[id];
        })
      ),
  }))
);
