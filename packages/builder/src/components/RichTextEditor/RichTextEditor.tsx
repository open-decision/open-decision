import {
  Box,
  focusStyleWithin,
  ScrollArea,
  styled,
} from "@open-decision/design-system";
import { EditorContent, Content, useEditor } from "@tiptap/react";
import { Toolbar } from "./Toolbar";
import { editorStyles, extensions } from "./shared";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";

const StyledEditorContent = styled(EditorContent, editorStyles, {
  $$height: "calc(100% - $space$2)",
  height: "$$height",

  ".ProseMirror": {
    outline: "none",
    margin: "1px",
    borderBottomLeftRadius: "$sm",
    borderBottomRightRadius: "$sm",
    height: "$$height",
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
      <ScrollArea.Root
        css={{
          minHeight: "200px",
          maxHeight: "500px",
          padding: "$2",
          layer: "2",
          border: "1px solid $gray7",
          focusType: "inner-within",
          borderBottomLeftRadius: "$md",
          borderBottomRightRadius: "$md",

          ...focusStyleWithin({
            "[data-scrollbar]": {
              margin: 1,
              borderBottomRightRadius: "$sm",
            },
          }),
        }}
      >
        <ScrollArea.Viewport
          // Without this the RichTextRenderer cannot take up 100% of the height and would therefore not be
          // focusable by clicking somewhere else, but the extisting text.
          css={{
            "& > div": {
              height: "100%",
            },
          }}
        >
          <StyledEditorContent editor={editor} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Box>
  );
};
