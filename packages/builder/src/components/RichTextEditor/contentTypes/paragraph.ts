import { RichTextContent } from "@open-decision/type-classes";
import { Overwrite } from "utility-types";

export const createParagraphNode = (
  children: RichTextContent.TText[] = [{ text: "" }]
): Overwrite<RichTextContent.TTextElements, { type: "paragraph" }> => ({
  type: "paragraph",
  children,
});
