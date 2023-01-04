import { mapValues } from "remeda";

const baseNotifications = {
  unarchived: {
    title: "Projekt erfolgreich unarchiviert",
    variant: "success",
  },
  archived: { title: "Projekt erfolgreich archiviert", variant: "success" },
  published: {
    title: "Projekt erfolgreich veröffentlicht",
    variant: "success",
  },
  unpublished: {
    title: "Projekt erfolgreich unveröffentlicht",
    variant: "success",
  },
  import: { title: "Projekt erfolgreich importiert", variant: "success" },
  export: { title: "Projekt bereit zum Speichern", variant: "success" },
  updateProject: {
    title: "Projekt erfolgreich aktualisiert",
    variant: "success",
  },
  deleteProject: { title: "Projekt erfolgreich gelöscht", variant: "success" },
  createProject: { title: "Projekt erfolgreich erstellt", variant: "success" },
  copyLink: { title: "Link kopiert", variant: "success" },
  "email-verified": {
    title: "E-Mail verifiziert",
    variant: "success",
    content: "Deine E-Mail-Adresse wurde erfolgreich verifiziert.",
  },
  enablePreview: {
    title: "Vorschau aktiviert",
    content:
      "Das Projekt kann nun von jedem unter folgendem Link abgerufen werden: {link}",
    variant: "success",
  },
  disablePreview: { title: "Vorschau deaktiviert", variant: "success" },
  addTemplate: { title: "Dokumentenvorlage hinzugefügt.", variant: "success" },
  deleteTemplate: { title: "Dokumentenvorlage gelöscht.", variant: "success" },
  addTheme: { title: "Theme hinzugefügt.", variant: "success" },
  removeTheme: { title: "Theme gelöscht.", variant: "success" },
};

export const notifications = mapValues(
  baseNotifications,
  ({ variant, ...notification }) => ({
    duration: "5",
    variant: variant ? variant : "info",
    content: "content" in notification ? notification.content : "",
    ...notification,
  })
);
