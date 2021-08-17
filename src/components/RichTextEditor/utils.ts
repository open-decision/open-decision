import { Editor, Element, Path, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { Overwrite } from "utility-types";
import {
  CustomElement,
  CustomText,
  GroupElement,
  LinkElement,
  TextElements,
} from "./types";

export const createGroupElement = (
  children: CustomElement[]
): GroupElement => ({
  type: "group",
  children,
});

export const createParagraphNode = (
  children: CustomText[] = [{ text: "" }]
): Overwrite<TextElements, { type: "p" }> => ({
  type: "p",
  children,
});

const createLinkNode = (href: string, text: string): LinkElement => ({
  type: "a",
  href,
  children: [{ text }],
});

const removeLink = (editor: Editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "a",
  });
};

export const insertLink = (editor: Editor, url: string): void => {
  if (!url) return;

  const { selection } = editor;
  const link = createLinkNode(url, "New Link");

  ReactEditor.focus(editor);

  if (selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      selection.focus?.path
    );

    const parentIsElement = Element.isElement(parentNode);

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentIsElement && parentNode.type === "a") {
      removeLink(editor);
    }

    if (parentIsElement && editor.isVoid(parentNode)) {
      // Insert the new link after the void node
      Transforms.insertNodes(editor, createGroupElement([link]), {
        at: Path.next(parentPath),
        select: true,
      });
    } else if (Range.isCollapsed(selection)) {
      // Insert the new link in our last known location
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      // Wrap the currently selected range of text into a Link
      Transforms.wrapNodes(editor, link, { split: true });
      // Remove the highlight and move the cursor to the end of the highlight
      Transforms.collapse(editor, { edge: "end" });
    }
  } else {
    // Insert the new link node at the bottom of the Editor when selection
    // is falsey
    Transforms.insertNodes(editor, createGroupElement([link]));
  }
};
