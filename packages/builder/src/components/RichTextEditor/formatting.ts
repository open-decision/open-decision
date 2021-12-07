import { RichTextContent } from "@open-decision/type-classes";
import { Editor, Element, Path, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { isLink } from "./contentTypes/link";
import { createListUtility, isList } from "./contentTypes/lists";

export function isBlockType(
  elemType: RichTextContent.TElements
): elemType is RichTextContent.TBlockElements {
  return RichTextContent.BlockTags.safeParse(elemType).success;
}

export const isElement =
  (editor: Editor) => (elemType: RichTextContent.TElements) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return Element.isElement(n) && n.type === elemType;
      },
    });

    return Boolean(match);
  };

export const isBooleanMarkActive =
  (editor: Editor) => (mark: keyof RichTextContent.TBooleanMarks) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[mark] === true,
      universal: true,
    });

    return Boolean(match);
  };

export const toggleBooleanMark =
  (editor: Editor) =>
  (mark: keyof RichTextContent.TBooleanMarks): void => {
    const isActive = isBooleanMarkActive(editor)(mark);
    Transforms.setNodes(
      editor,
      { [mark]: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    );
    ReactEditor.focus(editor);
  };

export const toggleElement =
  (editor: Editor) =>
  (elemType: RichTextContent.TElements): void => {
    const isActive = isElement(editor)(elemType);
    const isListElement = isList(elemType);
    const isLinkElement = isLink(elemType);

    Transforms.unwrapNodes(editor, {
      match: (n) => {
        return !Editor.isEditor(n) && Element.isElement(n) && isList(n.type);
      },
      split: true,
    });

    const newProperties: Partial<Element> = {
      type: isActive ? "paragraph" : isListElement ? "list_item" : elemType,
    };

    Transforms.setNodes<Element>(editor, newProperties);

    if (!isActive && isListElement && !isLinkElement) {
      const block: Element = { type: elemType, children: [] };
      Transforms.wrapNodes(editor, block);
    }

    ReactEditor.focus(editor);
  };

export const toggleList =
  (editor: Editor) => (elemType: RichTextContent.TListTags) => {
    if (!editor.selection) return;
    const isActive = isElement(editor)(elemType);

    if (isActive) {
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && isList(n.type),
        split: true,
      });

      Transforms.setNodes(editor, { type: "paragraph" });
    }

    if (!isActive) {
      Transforms.setNodes(editor, { type: "list_item" });
      const block: Element = { type: elemType, children: [] };
      Transforms.wrapNodes(editor, block);
    }

    ReactEditor.focus(editor);
  };
