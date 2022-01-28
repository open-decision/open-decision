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

  // Empty link elements are removed when normalizing the data output of the Editor.
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
          Transforms.insertNodes(
            editor,
            { text: " " },
            {
              at: Path.next(Path.parent(editor.selection.focus.path)),
              select: true,
            }
          );
        }

        if (!Editor.isEmpty(editor, child)) return;

        // remove link nodes whose text value is an empty string.
        // empty text links happen when you break from a link to the next line or delete a link line.
        if (children.length === 1) {
          Transforms.removeNodes(editor, { at: path });
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          });
        } else {
          Transforms.removeNodes(editor, { at: childPath });
        }
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
