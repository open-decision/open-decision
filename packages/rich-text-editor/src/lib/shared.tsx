import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Link from "@tiptap/extension-link";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import { headingClasses, textClasses } from "@open-decision/design-system";

export const editorClasses =
  "list-inside colorScheme-primary flex gap-[10px] flex-col outline-none h-full";

export const extensions = [
  Document,
  Heading.configure({
    HTMLAttributes: {
      class: headingClasses({ size: "medium" }),
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: textClasses({ size: "large" }),
    },
  }),
  Text,
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal pl-4",
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc pl-4",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "list-item [&_p]:list-inside [&_p]:inline",
    },
  }),
  Bold,
  Italic,
  Underline,
  HardBreak,
  Dropcursor,
  Gapcursor,
  Link,
];
