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
import { headingStyles, textStyles } from "@open-decision/design-system";

export const extensions = [
  Document,
  Heading.configure({
    HTMLAttributes: {
      class: headingStyles({ size: "medium" }),
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: textStyles(),
    },
  }),
  Text,
  OrderedList.configure({
    HTMLAttributes: {
      class: textStyles(),
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: textStyles(),
    },
  }),
  ListItem,
  Bold,
  Italic,
  Underline,
  HardBreak,
  Dropcursor,
  Gapcursor,
  Link,
];
