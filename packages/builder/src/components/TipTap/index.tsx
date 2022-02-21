import {
  Box,
  headingStyles,
  styled,
  textStyles,
} from "@open-legal-tech/design-system";
import { useEditor, EditorContent, Content } from "@tiptap/react";
import { Toolbar } from "components/RichTextEditor/Toolbar";
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
import { yDoc, yTreeMap } from "features/Builder/state/treeStore/treeStore";
import { useNode } from "features/Builder/state/treeStore/hooks";

const StyledEditorContent = styled(EditorContent, {
  ".ProseMirror": {
    minHeight: "200px",
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    overflow: "auto",
    maxHeight: "100%",
    padding: "$2",
    backgroundColor: "$gray1",
    borderBottomLeftRadius: "$md",
    borderBottomRightRadius: "$md",
    focusStyle: "inner-within",
    border: "1px solid $gray8",
  },
});

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Heading.configure({
        HTMLAttributes: {
          class: headingStyles({ size: "extra-small" }),
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: textStyles({ size: "small" }),
        },
      }),
      Text,
      OrderedList,
      BulletList,
      ListItem,
      Bold,
      Italic,
      Underline,
      HardBreak,
      Dropcursor,
      GapCursor,
      Link,
      Collaboration.configure({ document: yDoc }),
    ],
  });

  return (
    <Box
      css={{
        display: "grid",
        overflow: "hidden",
        maxHeight: "600px",
        gridTemplateRows: "50px 1fr",
        $color: "$black",
      }}
    >
      <Toolbar
        editor={editor}
        css={{
          border: "1px solid $gray8",
          borderBottom: "0",
          borderTopLeftRadius: "$md",
          borderTopRightRadius: "$md",
        }}
      />
      <StyledEditorContent editor={editor} />
    </Box>
  );
};
