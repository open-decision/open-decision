import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type Elements = "paragraph" | "h1" | "h2" | "h3";

export type CustomElement = { type: Elements; children: CustomText[] };

export type Marks = { bold?: boolean; italic?: boolean; underline?: boolean };

export type CustomText = {
  text: string;
} & Marks;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
