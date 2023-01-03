export default {
  pageTitle: "Dashboard | Open Decision",
  title: "Meine Projekte",
  treeList: {
    fullError: "Beim laden deiner Bäume ist ein Fehler aufgetreten.",
    search: {
      label: "Suche",
      placeholder: "Suche",
    },
    noResults: "Keine Projekte gefunden",
    empty: {
      title: "Du hast noch kein Open-Decision-Projekt.",
      callToAction: "Erstelle oder importiere jetzt dein erstes Projekt.",
    },
    treeCard: {
      hiddenTitleLink: "Öffne das Projekt {name}",
      ACTIVE: "Aktiv",
      ARCHIVED: "Archiviert",
      published: "Veröffentlicht",
      menu: {
        hiddenLabel: "Projektmenü für {name}",
      },
    },
  },
} as const;
