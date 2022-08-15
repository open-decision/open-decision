export default {
  pageTitle: "Builder | OD",
  nodeSearch: {
    placeholder: "Suche",
    selectBadge: "Auswählen",
    createBadge: "Erstellen",
  },
  createNodeButton: {
    tooltip: "Neuen Knoten hinzufügen",
    hiddenLabel: "Füge einen leeren Knoten hinzu",
  },
  nodeEditingSidebar: {
    nameInput: {
      label: "Knotenname",
      placeholder: "Mein Knoten",
    },
    richTextEditor: {
      label: "Inhalt",
    },
    parentNodeSelector: {
      label: "Elternknoten",
      noNameFallback: "Elternknoten ohne Name",
    },
    nodeLabels: {
      startNode: "Start",
    },
    menu: {
      iconLabel: "Öffne Menü für Knoten {name}",
      previewLabel: "Vorschau",
      deleteNode: {
        label: "Knoten löschen",
        disabledForStartNodeLabel:
          "Der Startknoten kann nicht entfernt werden.",
      },
      makeStartNode: {
        label: "Zum Startknoten machen",
      },
    },
  },
  canvas: {
    questionNode: {
      empty: {
        hiddenLabel:
          "{content, select, true {{name}} other {Leerer Frageknoten}} - {selected, select, true {ausgewählt} false {nicht ausgewählt} other {}}",
      },
    },
    zoomInAndOut: {
      zoomIn: { hiddenLabel: "Zoom in" },
      zoomOut: { hiddenLabel: "Zoom out" },
    },
  },
  projectMenu: {
    backToDashboard: "Zurück zum Dashboard",
    changeName: "Namen ändern",
    export: "Exportieren",
    delete: "Projekt löschen",
  },
} as const;
