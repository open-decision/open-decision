import errors from "./errors";
import { notifications } from "./notifications";

export default {
  errors,
  notifications,
  header: { homeButtonHiddenLabel: "Zurück zum Dashboard" },
  notificationsGeneral: {
    closeIconHiddenLabel: "Benachrichtigung schließen",
  },
  ErrorCard: {
    titleFallback: "Es ist ein unbekannter Fehler aufgetreten",
    descriptionFallback: "Bitte lade die Seite neu.",
    callToAction:
      "Sollte der Fehler weiterhin auftreten dann erstelle bitte einen Bugreport hier:",
    errorReportLink: "Bug Reports",
  },
  UserMenu: {
    label: "Account",
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
      placeholder: "Mein Projektname",
    },
    submit: "Erstellen",
  },
  deleteTreeDialog: {
    title: "Projekt löschen",
    description:
      "Bitte geben Sie den Namen des Projekts: <bold>{treeName}</bold> zur Bestätigung der Löschung ein.",
    submit: "Löschen",
    treeNameInput: {
      label: "Projektname",
    },
  },
  updateTreeDialog: {
    title: "Projektname ändern",
    treeNameInput: {
      label: "Projektname",
      placeholder: "Mein Projektname",
    },

    submit: "Ändern",
  },
  exportDialog: {
    title: "Projekt exportieren",
    customization: {
      description: "Nehmen Sie Anpassungen am Export vor.",
      nameInput: { label: "Dateiname" },
      submit: "Weiter",
    },
    save: {
      description: "Speichern Sie ihr exportiertes Projekt.",
      cta: "Speichern",
    },
    errorFallback: "Beim Export ihres Projektes ist ein Fehler aufgetreten.",
  },
  projectMenu: {
    changeName: "Namen ändern",
    export: "Exportieren",
    publish: {
      publish: "Veröffentlichen",
      unpublish: "Unveröffentlichen",
      open: "Öffnen",
      copyLink: "Link kopieren",
    },
    archive: "Archivieren",
    unarchive: "Unarchivieren",
    delete: "Projekt löschen",
    disabledDeletePublishedTreeTooltip:
      "Ein veröffentlichter Baum kann nicht gelöscht werden. Bitte unveröffentliche den Baum erst.",
  },
} as const;
