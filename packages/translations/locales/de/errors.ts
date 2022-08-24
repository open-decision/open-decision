import type { ErrorCodes } from "@open-decision/type-classes";

const errorMessages: Record<ErrorCodes, { short: string; long: string }> = {
  VALIDATION_ERROR: {
    short: "Servererror",
    long: "Es ist ein Servererror aufgetreten.",
  },
  INCORRECT_EMAIL_OR_PASSWORD: {
    short: "Falsche Email oder Passwort",
    long: "Sie haben eine falsche Email-Adresse oder ein falsches Passwort eingegeben.",
  },
  UNEXPECTED_ERROR: {
    short: "Unbekannter Fehler",
    long: "Ein unbekannter Error ist aufgetreten. Bitte lade die Seite neu.",
  },
  UNAUTHENTICATED: {
    short: "Du bist nicht angemeldet",
    long: "Bitte melde dich an, um fortzufahren.",
  },
  NO_TREE_DATA: {
    short: "Kein Inhalt",
    long: "Ein Projekt ohne Inhalt kann nicht veröffentlicht werden.",
  },
  IMPORT_INVALID_FILE: {
    short: "Ungültige Datei",
    long: "Die Datei enthält keinen gültigen Entscheidungsbaum.",
  },
  OFFLINE: {
    short: "Offline",
    long: "Es konnte keine Verbindung zum Server hergestellt werden.",
  },
  AUTH_VALIDATION_FAILED: {
    short: "Falsche Anmeldedaten",
    long: "Bitte überprüfe deine Eingaben.",
  },
  EMAIL_ALREADY_USED: {
    short: "Email-Adresse bereits verwendet",
    long: "Die angegebene Email Adresse wird schon von einem anderen Account verwendet.",
  },
  EMAIL_NOT_SEND: {
    short: "Email konnte nicht versendet werden",
    long: "Bitte überprüfe, ob die angegebene Email-Adresse korrekt ist.",
  },
  EMAIL_NOT_WHITELISTED: {
    short: "Email-Adresse nicht berechtigt",
    long: "Bitte melde dich beim Betreiber von Open Decision, um zur frühen Nutzung der App berechtigt zu werden.",
  },
  EMAIL_VERIFICATION_FAILED: {
    short: "Überprüfung der Email-Adresse fehlgeschlagen",
    long: "Bitte überprüfe, ob die angegebene Email-Adresse korrekt ist.",
  },
  EXPIRED_TOKEN: {
    short: "Login-Zeit abgelaufen",
    long: "Bitte melde dich erneut an, um auf deine Open Decision App zuzugreifen.",
  },
  FORBIDDEN: {
    short: "Zugriff verboten",
    long: "Der Zugriff auf diese Ressource ist derzeit verboten.",
  },
  GENERIC_ERROR: {
    short: "Allgemeiner Fehler",
    long: "Möglicherweise handelt es sich bei dem Fehler um ein Zugriffs- oder Netzwerkproblem.",
  },
  INTERNAL_SERVER_ERROR: {
    short: "Servererror",
    long: "Auf dem Server der App scheint etwas schiefgelaufen zu sein. Wir bemühen uns das Problem so schnell wie möglich zu fixen.",
  },
  INVALID_DATA: {
    short: "Ungültige Daten",
    long: "Die eingegebenen Daten stimmen nicht mit denen im System überein.",
  },
  INVALID_EMAIL: {
    short: "Ungültige Email-Adresse",
    long: "Bitte überprüfe, ob die angegebene Email-Adresse korrekt ist.",
  },
  INVALID_TREE: {
    short: "Ungültige Datei",
    long: "Diese Open Decision Projektdatei ist leider ungültig.",
  },
  MISSING_STARTNODE: {
    short: "Fehlender Startknoten",
    long: "Erstelle deinen ersten Knoten, um auf die Baumvorschau zugreifen zu können.",
  },
  NO_CURRENT_NODE: {
    short: "Kein Knoten ausgewählt",
    long: "Wähle auf dem Builder-Canvas, oder im Knoten-Suchfeld einen Knoten aus.",
  },
  NO_EDGE_FOR_THRUTHY_CONDITION: {
    short: "Keine Verbindung",
    long: "Es konnte zwar eine korrekte logische Operation gefunden werden, aber keine dazu passende Verbindung.",
  },
  NO_TRUTHY_CONDITION: {
    short: "Keine korrekte logische Operation",
    long: "Es konnte keine korrekte logische Operation gefunden werden.",
  },
  NOT_FOUND: {
    short: "Website konnte nicht gefunden werden",
    long: "Die angeforderte URL wurde nicht gefunden.",
  },
  PASSWORD_RESET_FAILED: {
    short: "Passwort konnte nicht zurückgesetzt werden",
    long: "Bitte überprüfe, ob die angegebene Email-Adresse korrekt ist.",
  },
  PASSWORD_TO_WEAK: {
    short: "Passwort zu schwach",
    long: "Dein Open Decision Passwort muss noch ein bisschen länger sein.",
  },
  UNAUTHORIZED: {
    short: "Nicht berechtigt",
    long: "Bitte überprüfe, ob die angegebenen Daten korrekt sind. Melde dich bei weiteren Fragen beim Betreiber von Open Decision.",
  },
  USER_NOT_FOUND: {
    short: "Account konnte nicht gefunden werden",
    long: "Bitte überprüfe, ob deine Eingaben korrekt sind.",
  },
  WEBSOCKET_CONNECTION_FAILED: {
    short: "WebSocket-Verbindung fehlgeschlagen",
    long: "Es konnte keine dauerhafte Verbindung mit dem Server hergestellt werden.",
  },
  WHITELIST_ENTRY_COULD_NOT_BE_CREATED: {
    short: "Whitelisteintrag konnte nicht erstellt werden",
    long: "Whitelisteintrag konnte nicht erstellt werden",
  },
  WHITELIST_ENTRY_COULD_NOT_BE_DELETED: {
    short: "Whitelisteintrag konnte nicht gelöscht werden",
    long: "Whitelisteintrag konnte nicht gelöscht werden",
  },
} as const;

export default errorMessages;
