import { Notification, notificationState } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useNotificationSnapshot } from "packages/design-system/src/Notifications/NotificationState";
import { useMessages } from "./messagesContext";

export const useNotificationStore = () => {
  const messages = useMessages();
  const t = useTranslations("common");
  const notifications = useNotificationSnapshot();

  const addNotificationFromTemplate = (
    notification: keyof Omit<
      typeof messages["common"]["notifications"],
      "general"
    >
  ) => {
    notificationState.addNotification({
      duration: Number(t(`notifications.${notification}.duration`)),
      title: t(`notifications.${notification}.title`),
      content: t(`notifications.${notification}.content`),
      variant:
        (messages.common.notifications?.[notification]
          .variant as Notification["variant"]) ?? "info",
    });
  };

  return { ...notificationState, notifications, addNotificationFromTemplate };
};
