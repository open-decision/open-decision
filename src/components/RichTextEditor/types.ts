import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type Element = {
  children: CustomText[];
} & ElementUnionMarks;

export type GroupElement = ElementUnionMarks & {
  type: "group";
  children: CustomElement[] | CustomText[];
};

export type TextTags = "p" | "h1" | "h2" | "h3";
export type TextElements = Element & { type: TextTags };

export type ListTags = "ul" | "ol" | "li";

export type ListElements = Element & { type: ListTags };

export type LinkElement = Element & { type: "a"; href: string };

export type CustomElement =
  | TextElements
  | ListElements
  | LinkElement
  | GroupElement;

export type Elements = CustomElement["type"];

export type TextBooleanMarks = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type ElementUnionMarks = {
  justify?: "left" | "center" | "right";
};

export type CustomText = {
  text: string;
} & TextBooleanMarks;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
