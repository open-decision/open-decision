import { useMessages } from "@open-decision/translations";
import { useTranslations } from "next-intl";
import { addNotification, Notification } from "./NotificationState";

export const useNotificationTemplate = () => {
  const messages = useMessages();
  const t = useTranslations("common");

  const addNotificationFromTemplate = (
    notification: keyof Omit<
      typeof messages["common"]["notifications"],
      "general"
    >
  ) => {
    addNotification({
      duration: Number(t(`notifications.${notification}.duration`)),
      title: t(`notifications.${notification}.title`),
      content: t(`notifications.${notification}.content`),
      variant:
        (messages.common.notifications?.[notification]
          .variant as Notification["variant"]) ?? "info",
    });
  };

  return addNotificationFromTemplate;
};

export type NotificationTemplate =
  | Parameters<ReturnType<typeof useNotificationTemplate>>[0]
  | false;
