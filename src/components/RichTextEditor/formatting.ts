import { Editor, Element, Text, Transforms } from "slate";
import { Elements, Marks } from "./types";

type onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => void;

export function onKeyDownHandler(editor: Editor): onKeyDownHandler {
  const toggleEditorMark = toggleMark(editor);
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
    }
  };
}

const isElement = (editor: Editor) => (elemType: Elements) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === elemType,
  });

  return Boolean(match);
};

const isMarkActive = (editor: Editor) => (mark: keyof Marks) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Text.isText(n) && n[mark] === true,
    universal: true,
  });

  return Boolean(match);
};

const toggleMark = (editor: Editor) => (mark: keyof Marks) => {
  const isActive = isMarkActive(editor)(mark);
  Transforms.setNodes(
    editor,
    { [mark]: isActive ? undefined : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

const toggleElement = (editor: Editor) => (elemType: Elements) => {
  const isElem = isElement(editor)(elemType);

  Transforms.setNodes(
    editor,
    { type: isElem ? "paragraph" : elemType },
    { match: (n) => Editor.isBlock(editor, n) }
  );
};
