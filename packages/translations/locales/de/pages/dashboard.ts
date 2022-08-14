export default {
  pageTitle: "Dashboard | OD",
  title: "Meine Projekte",
  treeList: {
    fullError: "Beim laden deiner Bäume ist ein Fehler aufgetreten.",
    search: {
      label: "Suche",
      placeholder: "Suche",
    },
    noResults: "Keine Projekte gefunden",
    empty: {
      title: "Sie haben noch kein Open-Decision-Projekt.",
      callToAction: "Erstellen oder importieren Sie jetzt ihr erstes Projekt.",
    },
    cardMenu: {
      hiddenLabel: "Projektmenü für {name}",
      changeName: "Name ändern",
      publish: "Veröffentlichen",
      unpublish: "Unveröffentlichen",
      archive: "Archivieren",
      unarchive: "Unarchivieren",
      deleteProject: "Projekt löschen",
    },
    treeCard: {
      hiddenTitleLink: "Öffne das Projekt {name}",
      ACTIVE: "Aktiv",
      ARCHIVED: "Archiviert",
      published: "Veröffentlicht",
    },
  },
} as const;
