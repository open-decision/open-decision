import { Notification } from "./NotificationState";

export const notificationTemplates: Record<string, Notification> = {
  "email-verified": {
    title: "E-Mail verifiziert",
    variant: "success",
    content: "Deine E-Mail-Adresse wurde erfolgreich verifiziert.",
  },
};
