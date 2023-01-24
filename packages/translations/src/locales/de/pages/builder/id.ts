export default {
  pageTitle: "Builder | OD",
  header: {
    preview: {
      button: "Preview teilen",
      popover: {
        title: "Preview teilen",
        description:
          "Wenn die Preview geteilt wird kann jeder mit dem Link die Preview öffnen.",
        checkbox: "Preview öffentlich teilen",
        copyLinkButton: {
          enabled: "Preview Link kopieren",
          disabled: "Aktiviere erst die Preview",
        },
        openSharedPreviewButton: "Öffne geteilte Preview",
      },
      previewLink: {
        hiddenLabel: "Preview öffnen",
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
      endNode: {
        add: {
          label: "Zu einem Endknoten machen",
        },
        remove: {
          label: "Endknoten entfernen",
        },
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
