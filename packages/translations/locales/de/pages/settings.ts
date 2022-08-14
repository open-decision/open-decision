export default {
  pageTitle: "Einstellungen | OD",
  title: "Einstellungen",
  account: {
    title: "Account",
    changeEmail: {
      title: "E-Mail ändern",
      submit: "E-Mail ändern",
      success: {
        title: "E-Mail Adresse erfolgreich geändert",
      },
    },
    changePassword: {
      title: "Passwort ändern",
      inputLabel: "Neues Passwort",
      submit: "Passwort ändern",
      success: {
        title: "Passwort erfolgreich geändert",
      },
    },
    deleteAccount: {
      title: "Account löschen",
      submit: "Account löschen",
      verifyOverlay: {
        description: "Bitte verifizieren Sie sich um Ihren Account zu löschen.",
        additionalMessage: {
          title: "Achtung!",
          content:
            "Das Löschen Ihres Accounts kann nicht rückgängig gemacht werden.",
        },
      },
    },
  },
} as const;
