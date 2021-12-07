import { RichTextContent } from "@open-decision/type-classes";
import { Editor, Element, Range, Transforms } from "slate";
import { z } from "zod";

export const Url = z.string().url();

export function isLink(
  elemType: RichTextContent.TElements
): elemType is RichTextContent.TLinkElement["type"] {
  return RichTextContent.LinkTag.safeParse(elemType).success;
}

export function isLinkElement(
  node: RichTextContent.TElement
): node is RichTextContent.TLinkElement {
  return RichTextContent.LinkElement.safeParse(node).success;
}

export const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && isLink(n.type),
  });

  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && isLink(n.type),
  });
};

export const wrapLink = (editor: Editor, possibleUrl: string): void => {
  const url = Url.safeParse(possibleUrl);

  if (!url.success) return;

  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link: RichTextContent.TLinkElement = {
    type: "link",
    url: url.data,
    children: isCollapsed ? [{ text: url.data }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const toggleLink = (editor: Editor) => {
  if (editor.selection) {
    if (isLinkActive(editor)) {
      return unwrapLink(editor);
    }

    const url = prompt("url");
    if (!url) return;

    return wrapLink(editor, url);
  }
};
