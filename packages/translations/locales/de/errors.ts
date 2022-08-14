import { ErrorCodes } from "@open-decision/type-classes";

const errorMessages: Record<ErrorCodes, { short: string; long: string }> = {
  VALIDATION_ERROR: {
    short: "Servererror",
    long: "Es ist ein Servererror aufgetreten",
  },
  INCORRECT_EMAIL_OR_PASSWORD: {
    short: "Falsche Email oder Passwort",
    long: "Sie haben eine falsche E-Mail Adresse oder ein falsches Passwort eingegeben.",
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
    short: "",
    long: "",
  },
  EMAIL_ALREADY_USED: {
    short: "Email bereits verwendet",
    long: "Die angegebene Email Adresse wird schon von einem anderen Account verwendet.",
  },
  EMAIL_NOT_SEND: { short: "", long: "" },
  EMAIL_NOT_WHITELISTED: { short: "", long: "" },
  EMAIL_VERIFICATION_FAILED: { short: "", long: "" },
  EXPIRED_TOKEN: { short: "", long: "" },
  FORBIDDEN: { short: "", long: "" },
  GENERIC_ERROR: { short: "", long: "" },
  INTERNAL_SERVER_ERROR: { short: "", long: "" },
  INVALID_DATA: { short: "", long: "" },
  INVALID_EMAIL: { short: "", long: "" },
  INVALID_TREE: { short: "", long: "" },
  MISSING_STARTNODE: { short: "", long: "" },
  NO_CURRENT_NODE: { short: "", long: "" },
  NO_EDGE_FOR_THRUTHY_CONDITION: { short: "", long: "" },
  NO_TRUTHY_CONDITION: { short: "", long: "" },
  NOT_FOUND: { short: "", long: "" },
  PASSWORD_RESET_FAILED: { short: "", long: "" },
  PASSWORD_TO_WEAK: { short: "", long: "" },
  UNAUTHORIZED: { short: "", long: "" },
  USER_NOT_FOUND: { short: "", long: "" },
  WEBSOCKET_CONNECTION_FAILED: { short: "", long: "" },
  WHITELIST_ENTRY_COULD_NOT_BE_CREATED: { short: "", long: "" },
  WHITELIST_ENTRY_COULD_NOT_BE_DELETED: { short: "", long: "" },
} as const;

export default errorMessages;
