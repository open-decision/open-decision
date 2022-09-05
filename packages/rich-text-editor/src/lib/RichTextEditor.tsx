import * as React from "react";
import { Box, ScrollArea, styled } from "@open-decision/design-system";
import { EditorContent, Content, useEditor, EditorEvents } from "@tiptap/react";
import { Toolbar } from "./Toolbar";
import { editorStyles, extensions } from "./shared";

const StyledEditorContent = styled(EditorContent, editorStyles, {
  $$height: "100%",
  height: "$$height",

  ".ProseMirror": {
    padding: "$2",
    outline: "none",
    height: "$$height",
  },
});

type Props = {
  content?: Content;
  onUpdate: (props: EditorEvents["update"]) => void;
  Label?: (props: { onClick: () => void }) => JSX.Element;
} & Omit<
  React.ComponentProps<typeof StyledEditorContent>,
  "editor" | "content"
>;

export const RichTextEditor = ({
  content,
  onUpdate,
  Label,
  ...props
}: Props) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate,
  });

  return (
    <>
      {Label?.({ onClick: () => editor?.commands.focus() })}
      <Box
        css={{
          display: "grid",
          gridTemplateRows: "50px max-content",
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
            layer: "2",
            border: "1px solid $gray7",
            borderBottomLeftRadius: "$md",
            borderBottomRightRadius: "$md",
            focusType: "inner-within",
            overflow: "hidden",
          }}
          data-focus={editor?.isFocused}
        >
          <ScrollArea.Viewport
            // Without this the RichTextRenderer cannot take up 100% of the height and would therefore not be
            // focusable by clicking somewhere else, but the extisting text.
            css={{
              height: "100%",

              "& > div": {
                height: "100%",
                display: "block !important",
              },
            }}
          >
            <StyledEditorContent editor={editor} {...props} />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Box>
    </>
  );
};
