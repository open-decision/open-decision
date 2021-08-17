import { Editor, Element, Text, Transforms } from "slate";
import { ValuesType } from "utility-types";
import {
  TextBooleanMarks,
  Elements,
  LinkElement,
  ListTags,
  ElementUnionMarks,
} from "./types";

const LIST_TYPES = ["ol", "ul"];

function isList(elemType: Elements): elemType is ListTags {
  return LIST_TYPES.includes(elemType);
}

function isLink(elemType: Elements): elemType is LinkElement["type"] {
  return elemType === "a";
}

type onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => void;

export function onKeyDownHandler(editor: Editor): onKeyDownHandler {
  const toggleEditorMark = toggleBooleanMark(editor);
  const toggleEditorElement = toggleElement(editor);

  return (event) => {
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
      case "1": {
        event.preventDefault();
        toggleEditorElement("h1");
        break;
      }
      case "2": {
        event.preventDefault();
        toggleEditorElement("h2");
        break;
      }
      case "3": {
        event.preventDefault();
        toggleEditorElement("h3");
        break;
      }
      case "l": {
        event.preventDefault();
        toggleEditorElement("ul");
        break;
      }
      case "o": {
        event.preventDefault();
        toggleEditorElement("ol");
        break;
      }
    }
  };
}

const isElement = (editor: Editor) => (elemType: Elements) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === elemType,
  });

  return Boolean(match);
};

const isBooleanMarkActive =
  (editor: Editor) => (mark: keyof TextBooleanMarks) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[mark] === true,
      universal: true,
    });

    return Boolean(match);
  };

export const toggleBooleanMark =
  (editor: Editor) =>
  (mark: keyof TextBooleanMarks): void => {
    const isActive = isBooleanMarkActive(editor)(mark);
    Transforms.setNodes(
      editor,
      { [mark]: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    );
  };

const isElementUnionMarkActive =
  (editor: Editor) =>
  <TMark extends keyof ElementUnionMarks>(
    mark: TMark,
    markValue: ValuesType<TMark>
  ) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n[mark] === markValue,
      universal: true,
    });

    return Boolean(match);
  };

export const toggleElementUnionMark =
  (editor: Editor) =>
  <TMark extends keyof ElementUnionMarks>(
    mark: TMark,
    markValue: ValuesType<TMark>
  ): void => {
    const isActive = isElementUnionMarkActive(editor)(mark, markValue);
    console.log(isActive);

    Transforms.setNodes(
      editor,
      { [mark]: isActive ? undefined : markValue },
      { match: (n) => Element.isElement(n) }
    );
  };

export const toggleElement =
  (editor: Editor) =>
  (elemType: Elements): void => {
    const isElemOfType = isElement(editor)(elemType);
    const isListElem = isList(elemType);
    const isLinkElem = isLink(elemType);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    let newProperties: Partial<Element>;

    newProperties = {
      type: isElemOfType ? "p" : isListElem ? "li" : elemType,
    };

    if (!isElemOfType && isLinkElem) {
      newProperties = {
        type: "a",
        href: "www.open-decision.org",
      };
    }

    Transforms.setNodes(editor, newProperties);

    if (!isElemOfType && isListElem) {
      const block = { type: elemType, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };
