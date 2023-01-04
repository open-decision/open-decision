import type { ErrorCodes } from "@open-decision/type-classes";

const errorMessages: Record<ErrorCodes, { short: string; long: string }> = {
  VALIDATION_ERROR: {
    short: "Servererror",
    long: "Es ist ein Servererror aufgetreten.",
  },
  INCORRECT_EMAIL_OR_PASSWORD: {
    short: "Falsche Email oder Passwort",
    long: "Du hast eine falsche Email-Adresse oder ein falsches Passwort eingegeben.",
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
    long: "Leider konnte keine E-Mail versandt werden. Bitte versuche es später erneut.",
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
  INVALID_FILETYPE: {
    short: "Ungültiger Dateityp",
    long: "Bitte überprüfe, ob die hochgeladene Datei vom richtigen Dateityp ist.",
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
    long: "Dein Open Decision Passwort muss komplexer sein.",
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
  PREVIEW_NOT_ENABLED: {
    short: "Vorschau nicht verfügbar",
    long: "Die Vorschau für dieses Projekt ist nicht aktiviert.",
  },
  CIRCULAR_CONNECTION: {
    short: "Fehlerhafte Verbindung",
    long: "Ein Knoten kann nicht mit sich selbst verbunden werden.",
  },
  DUPLICATE_EDGE: {
    short: "Doppelte Verbindung",
    long: "Eine Verbindung zwischen diesen Knoten existiert bereits.",
  },
  CONNECTED_TO_SELF: {
    short: "Fehlerhafte Verbindung",
    long: "Eine Verbindung zwischen diesen Knoten würde zu einer zirkulären Verbindung führen.",
  },
  NO_ACCESSIBLE_OBJECT_FOUND: {
    short: "Kein zugängliches Objekt gefunden",
    long: "Es konnte kein Objekt gefunden werden, auf das du Zugriff hast.",
  },
  DOC_GENERATION_NOT_CONFIGURED: {
    short: "Dokumentengenerierung nicht möglich",
    long: "Die Dokumentengenerierung ist für diesen Server nicht konfiguriert.",
  },
  DOC_GENERATION_FAILED: {
    short: "Die Dokumententgenerierung ist fehlgeschlagen",
    long: "Leider ist bei der Generierung des Dokumentes ein Fehler aufgetreten.",
  },
  TEMPLATE_UPLOAD_FAILED: {
    short: "Upload des Template ist fehlgeschlagen",
    long: "Leider ist beim Upload des Templates ein Fehler aufgetreten.",
  },
  PUBLISHING_OF_TEMPLATES_FAILED: {
    short: "Veröffentlichung der verknüpften Templates ist fehlgeschlagen",
    long: "Bei der Veröffentlichung der mit diesem Entscheidungsbaum verknüpften Templates ist ein Fehler aufgetreten.",
  },
  INVALID_DOCUMENT_TEMPLATE: {
    short: "Ungültiges Dokumententemplate",
    long: "Das hochgeladene Dokumententemplate ist ungültig.",
  },
  FILE_UPDATED_UPDATE_DB_ENTRY_FAILED: {
    short: "Template Datei aber nicht der Name geupdatet",
    long: "Die Template Date wurde erfolgreich geupdatet, die Änderung des Datenbankeintrags ist aber fehlgeschlagen.",
  },
  MISSING_TEMPLATE_UUID: {
    short: "Template fehlt.",
    long: "Bitte lege ein Template für diese Dokumentengenerierung fest.",
  },
  MISSING_TREE_IN_MODULE: {
    short: "Entscheidungsbaum fehlt.",
    long: "Bitte lege einen Entscheidungsbaum für dieses Modul fest.",
  },
  TOKEN_NOT_FOUND: {
    short: "Upload fehlgeschlagen.",
    long: "Bitte starte den Upload erneut.",
  },
} as const;

export default errorMessages;
