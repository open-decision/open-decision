import {
  Box,
  headingStyles,
  styled,
  textStyles,
} from "@open-legal-tech/design-system";
import { useEditor, EditorContent, Content } from "@tiptap/react";
import { Toolbar } from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import GapCursor from "@tiptap/extension-gapcursor";
import Link from "@tiptap/extension-link";
import Collaboration from "@tiptap/extension-collaboration";
import {
  updateNodeContent,
  yDoc,
} from "features/Builder/state/treeStore/treeStore";

const StyledEditorContent = styled(EditorContent, {
  focusStyle: "inner-within",
  border: "1px solid $gray8",
  overflow: "auto",
  borderBottomLeftRadius: "$md",
  borderBottomRightRadius: "$md",
  minHeight: "200px",
  maxHeight: "500px",
  layer: "2",

  ".ProseMirror": {
    colorScheme: "primary",
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    padding: "$2",
    outline: "none",
    margin: "1px",
    borderBottomLeftRadius: "$sm",
    borderBottomRightRadius: "$sm",
    height: "100%",
  },
});

type Props = { id: string; content: Content };

export const Tiptap = ({ id, content }: Props) => {
  const editor = useEditor({
    extensions: [
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
      GapCursor,
      Link,
      Collaboration.configure({
        document: yDoc,
        field: id,
      }),
    ],
    content,
    onUpdate: ({ editor }) => updateNodeContent(id, editor.getJSON()),
  });

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateRows: "50px 1fr",
        groupColor: "$colorScheme-text",
      }}
    >
      <Toolbar
        editor={editor}
        css={{
          border: "1px solid $gray8",
          borderBottom: "0",
          borderTopLeftRadius: "$md",
          borderTopRightRadius: "$md",
          layer: "3",
        }}
      />
      <StyledEditorContent editor={editor} />
    </Box>
  );
};
