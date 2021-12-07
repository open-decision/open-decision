import { Editor, Element, Node, Path, Text, Transforms } from "slate";
import { createListUtility } from "./contentTypes/lists";
import { toggleBooleanMark, toggleElement } from "./formatting";

type onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => void;

export function onKeyDownHandler(editor: Editor): onKeyDownHandler {
  const toggleEditorMark = toggleBooleanMark(editor);
  const toggleEditorElement = toggleElement(editor);
  const List = createListUtility(editor);

  return (event) => {
    if (!editor.selection) return;
    const currentPath = editor.selection.focus.path;
    const selectedElement = Node.descendant(
      editor,
      editor.selection.anchor.path.slice(0, -1)
    );

    if (!Element.isElement(selectedElement)) return;

    if (event.key === "Enter") {
      if (selectedElement.type === "heading") {
        event.preventDefault();
        const selectedLeaf = Node.descendant(
          editor,
          editor.selection.anchor.path
        );

        if (!Text.isText(selectedLeaf)) return;

        const isSelectionAtTheEndOfLeaf =
          selectedLeaf.text.length === editor.selection.anchor.offset;
        const isSelectionAtTheStartOfLeaf = Editor.isStart(
          editor,
          editor.selection.anchor,
          editor.selection.anchor.path
        );

        if (isSelectionAtTheEndOfLeaf) {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          });
        } else if (isSelectionAtTheStartOfLeaf) {
          const locationBeforeSelection = Editor.before(
            editor,
            editor.selection.anchor.path
          ) ?? [0];

          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
            { at: locationBeforeSelection }
          );
        } else {
          Transforms.splitNodes(editor);
          Transforms.setNodes(editor, { type: "paragraph" });
        }
      }

      if (List instanceof Error) return;
      const listPath = List.getListPath(currentPath);
      const isFirstElement = List.isFirst(currentPath);
      const isLastElement = List.isLast(editor, currentPath);

      if (
        Editor.isEmpty(editor, selectedElement) &&
        (isFirstElement || isLastElement)
      ) {
        event.preventDefault();
        Transforms.removeNodes(editor);

        const pathAfterList = Path.next(listPath);

        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
          { at: isFirstElement ? listPath : pathAfterList, select: true }
        );
      }
    }

    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "b": {
        event.preventDefault();
        toggleEditorMark("bold");
        break;
      }
      case "i": {
        event.preventDefault();
        toggleEditorMark("italic");
        break;
      }
      case "u": {
        event.preventDefault();
        toggleEditorMark("underline");
        break;
      }
      case "h": {
        event.preventDefault();
        toggleEditorElement("heading");
        break;
      }
      case "l": {
        event.preventDefault();
        toggleEditorElement("unordered_list");
        break;
      }
      case "o": {
        event.preventDefault();
        toggleEditorElement("ordered_list");
        break;
      }
      case "a": {
        event.preventDefault();
        toggleEditorElement("link");
        break;
      }
    }
  };
}
