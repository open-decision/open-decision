export default {
  pageTitle: "Builder | Open Decision",
  header: {
    prototypeButton: {
      button: "Prototyp teilen",
      popover: {
        title: "Prototyp teilen",
        description:
          "Wenn der Prototyp aktiviert ist kann jeder mit dem Link den Projekt-Prototyp ansehen.",
        checkbox: "Prototyp aktivieren",
        newTabLink: "In neuem Tab öffnen",
        copyLinkButton: "Link kopieren",
      },
    },
  },
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
      finalNode: "Ende",
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
      fitView: { hiddenLabel: "Fokussiere das Projekt" },
    },
  },
} as const;
