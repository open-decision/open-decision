import { RichTextContent } from "@open-decision/type-classes";
import { Editor, Node, Path, Element } from "slate";

export function isList(
  elemType: RichTextContent.TElements
): elemType is RichTextContent.TListTags {
  return RichTextContent.ListTags.safeParse(elemType).success;
}

export function isListElement(
  element: RichTextContent.TElement
): element is RichTextContent.TListElements {
  return RichTextContent.ListItemTag.safeParse(element.type).success;
}

function isListActive(editor: Editor): boolean | Error {
  if (!editor.selection)
    return new Error(`There is nothing selected in the Text Editor.`);

  const selectedElement = Node.descendant(
    editor,
    editor.selection.anchor.path.slice(0, -1)
  );

  if (!Element.isElement(selectedElement))
    return new Error(`The selected Node is not an Element`);

  return isListElement(selectedElement);
}

function getListPath(currentPath: Path) {
  return Path.parent(Path.parent(currentPath));
}

function getListItemPath(currentPath: Path) {
  return Path.parent(currentPath);
}

function isFirst(currentPath: Path) {
  return !Path.hasPrevious(getListItemPath(currentPath));
}

function isLast(editor: Editor, currentPath: Path) {
  const listPath = getListPath(currentPath);

  return Path.equals(Node.last(editor, listPath)[1], currentPath);
}

export function createListUtility(editor: Editor) {
  const isList = isListActive(editor);

  if (isList instanceof Error) return isList;

  return {
    getListPath,
    getListItemPath,
    isFirst,
    isLast,
  };
}
