import { RichTextContent } from "@open-decision/type-classes";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: RichTextContent.CustomElement;
    Text: RichTextContent.CustomText;
  }
}
