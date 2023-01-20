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
      required: "Bitte gib einen Projektnamen ein.",
    },
    submit: "Erstellen",
  },
  deleteTreeDialog: {
    title: "Projekt löschen",
    description:
      "Bitte gib den Namen des Projekts: <bold>{treeName}</bold> zur Bestätigung der Löschung ein.",
    submit: "Löschen",
    treeNameInput: {
      label: "Projektname",
    },
  },
  updateTreeDialog: {
    title: "Projektnamen ändern",
    treeNameInput: {
      label: "Projektname",
      placeholder: "Mein Projektname",
    },

    submit: "Ändern",
  },
  overwriteTreeDialog: {
    title: "Projekt überschreiben",
    description:
      "Bitte wähle ein exportiertes Projekt aus um es in das aktuelle Projekt zu überschreiben.",
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
  projectMenu: {
    overwriteTree: "Projektinhalt überschreiben",
    changeName: "Namen ändern",
    export: "Exportieren",
    uploadTheme: "Theme hochladen",
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
  nodeNames: {
    decision: { short: "Entscheidung", long: "Entscheidungsknoten" },
    form: { short: "Formular", long: "Formularknoten" },
    "node-group": { short: "Gruppe", long: "Gruppenknoten" },
    info: { short: "Information", long: "Informationsknoten" },
    document: {
      short: "Dokumentengenerierung",
      long: "Dokumentengenerierungsknoten",
    },
    placeholder: { short: "Platzhalter", long: "Platzhalterknoten" },
  },
  inputNames: {
    select: "Einfachauswahl",
    "multi-select": "Mehrfachauswahl",
    text: "Texteingabe",
    placeholder: "Platzhalter",
  },
} as const;
