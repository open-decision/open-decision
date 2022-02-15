import { isLink, isLinkElement, Url, wrapLink } from "./contentTypes/link";
import { Editor, Element, Node, Path, Transforms } from "slate";

export const withInlines = (editor: Editor): Editor => {
  const { insertData, insertText, isInline, normalizeNode } = editor;

  // We add links to the inline elements
  editor.isInline = (element) => isLink(element.type) || isInline(element);

  // When inserting text we automatically check for a valid url and wrap the text in a link when we detect a url.
  editor.insertText = (text) => {
    if (text && Url.safeParse(text).success) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && Url.safeParse(text).success) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (!Element.isElement(node)) return;

    const children = Array.from(Node.children(editor, path));

    for (const [child, childPath] of children) {
      if (Element.isElement(child) && isLinkElement(child)) {
        const textContent = Node.string(child);

        if (textContent.endsWith(" ") && editor.selection) {
          Transforms.select(editor, {
            anchor: { offset: 0, path: editor.selection.anchor.path },
            focus: editor.selection.focus,
          });
          Transforms.insertText(editor, textContent.trimEnd());
          return Transforms.insertNodes(
            editor,
            { text: " " },
            {
              at: Path.next(Path.parent(editor.selection.focus.path)),
              select: true,
            }
          );
        }

        if (!Editor.isEmpty(editor, child)) return;

        return Transforms.removeNodes(editor, { at: childPath });
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
