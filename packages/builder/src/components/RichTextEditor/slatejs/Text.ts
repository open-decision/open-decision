import { Text as SlateText, Node } from "slate";

export const Text = {
  isEmpty: (text: Node) => {
    return Text.isText(text) && Text.equals(text, { text: "" });
  },
  ...SlateText,
};
