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
    successNotification: "Baum erfolgreich erstellt",
  },
  deleteTreeDialog: {
    title: "Projekt löschen",
    description:
      "Bitte geben Sie den Namen des Projekts: <bold>{treeName}</bold> zur Bestätigung der Löschung ein.",
    submit: "Löschen",
    successNotification: "Baum erfolgreich gelöscht",
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
    successNotification: "Baum erfolgreich aktualisiert",
  },
  exportDialog: {
    title: "Projekt exportieren",
    customization: {
      description: "Nehmen Sie Anpassungen am Export vor.",
      nameInput: { label: "Dateiname" },
      submit: "Weiter",
    },
    save: {
      description: "Speichern Sie ihren exportierten Baum.",
      cta: "Speichern",
    },
    errorFallback: "Beim Export ihres Baumes ist ein Fehler aufgetreten.",
  },
  successNotifications: {
    unarchived: "Baum erfolgreich unarchiviert",
    archived: "Baum erfolgreich archiviert",
    published: "Baum erfolgreich veröffentlicht",
    unpublished: "Baum erfolgreich unveröffentlicht",
    import: "Baum erfolgreich importiert",
    export: "Baum erfolgreich exportiert",
  },
} as const;
