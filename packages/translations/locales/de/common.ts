import errors from "./errors";

export default {
  errors,
  ErrorCard: {
    titleFallback: "Es ist ein unbekannter Fehler aufgetreten",
    descriptionFallback: "Bitte lade die Seite neu.",
    callToAction:
      "Sollte der Fehler weiterhin auftreten dann erstelle bitte einen Bugreport hier:",
    errorReportLink: "Bug Reports",
  },
  UserMenu: {
    label: "Mein Account",
  },
  NewProjectDropdown: {
    label: "Projekt erstellen",
    createProjectLabel: "Neues Projekt erstellen",
    importProject: {
      label: "Projekt importieren",
    },
  },
  glossary: {
    settings: "Einstellungen",
    logout: "Logout",
  },
  emailInput: {
    label: "Mailadresse",
    placeholder: "beispiel@web.de",
  },
  passwordInput: {
    label: "Passwort",
    forgotPasswordLink: "Passwort vergessen?",
  },
  verifyLogin: {
    descriptionFallback: "Bitte bestätige deine Identität.",
    submit: "Bestätigen",
  },
  createTreeDialog: {
    title: "Neues Projekt erstellen",
    treeNameInput: {
      label: "Projektname",
    },
    submit: "Erstellen",
    successNotification: "Projekt erfolgreich erstellt",
  },
  deleteTreeDialog: {
    title: "Projekt löschen",
    description:
      "Bitte gib den Namen des Projekts: <bold>{treeName}</bold> zur Bestätigung der Löschung ein.",
    submit: "Löschen",
    successNotification: "Projekt erfolgreich gelöscht",
    treeNameInput: {
      label: "Projektname",
    },
  },
  updateTreeDialog: {
    title: "Projektname ändern",
    treeNameInput: {
      label: "Projektname",
    },

    submit: "Ändern",
    successNotification: "Projekt erfolgreich aktualisiert",
  },
  exportDialog: {
    title: "Projekt exportieren",
    customization: {
      description: "Nimm Anpassungen am Export vor.",
      nameInput: { label: "Dateiname" },
      submit: "Weiter",
    },
    save: {
      description: "Speichere dein exportiertes Projekt.",
      cta: "Speichern",
    },
    errorFallback: "Beim Export deines Projektes ist ein Fehler aufgetreten.",
  },
  successNotifications: {
    unarchived: "Projekt erfolgreich unarchiviert",
    archived: "Projekt erfolgreich archiviert",
    published: "Projekt erfolgreich veröffentlicht",
    unpublished: "Projekt erfolgreich unveröffentlicht",
    import: "Projekt erfolgreich importiert",
    export: "Projekt erfolgreich exportiert",
  },
} as const;
