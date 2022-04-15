import { Box, styled } from "@open-decision/design-system";
import { EditorContent, Content, useEditor } from "@tiptap/react";
import { Toolbar } from "./Toolbar";
import { extensions } from "./shared";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";

const StyledEditorContent = styled(EditorContent, {
  focusType: "inner-within",
  border: "1px solid $gray7",
  overflow: "auto",
  borderBottomLeftRadius: "$md",
  borderBottomRightRadius: "$md",
  minHeight: "200px",
  maxHeight: "500px",
  layer: "2",
  padding: "$2",

  ".ProseMirror": {
    colorScheme: "primary",
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    outline: "none",
    margin: "1px",
    borderBottomLeftRadius: "$sm",
    borderBottomRightRadius: "$sm",
    height: "calc(100% - $space$2)",
  },
});

type Props = { id: string; content: Content };

export const RichTextEditor = ({ id, content }: Props) => {
  const { updateNodeContent } = useTreeContext();

  const editor = useEditor({
    extensions,
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
          border: "1px solid $gray7",
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
