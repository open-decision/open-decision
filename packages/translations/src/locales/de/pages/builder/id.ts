export default {
  pageTitle: "Builder | OD",
  header: {
    preview: {
      button: "Vorschau teilen",
      popover: {
        title: "Vorschau teilen",
        description:
          "Wenn die Vorschau geteilt wird kann jeder mit dem Link die Vorschau öffnen.",
        checkbox: "Vorschau öffentlich teilen",
        copyLinkButton: {
          enabled: "Vorschau Link kopieren",
          disabled: "Aktiviere erst die Vorschau",
        },
        openSharedPreviewButton: "Öffne geteilte Vorschau",
      },
      previewLink: {
        hiddenLabel: "Vorschau öffnen",
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
    toolbar: {
      zoomIn: { hiddenLabel: "Zoom in" },
      zoomOut: { hiddenLabel: "Zoom out" },
      fitView: { hiddenLabel: "Fokussiere das Projekt" },
      undo: {
        hiddenLabel: {
          enabled: "Rückgängig machen",
          disabled: "Rückgängig machen (deaktiviert)",
        },
      },
      redo: {
        hiddenLabel: {
          enabled: "Wiederherstellen",
          disabled: "Wiederherstellen (deaktiviert)",
        },
      },
    },
  },
} as const;
