import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type ParagraphElement = {
  type: "paragraph";
  bold?: boolean;
  children: CustomText[];
};

export type CustomText = { text: string; bold?: boolean; italic?: boolean };

export type CustomElements = ParagraphElement;

export type CustomEditor = BaseEditor & ReactEditor;

export type CustomNode = CustomElements | CustomText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElements;
    Text: CustomText;
    Node: CustomNode;
  }
}
