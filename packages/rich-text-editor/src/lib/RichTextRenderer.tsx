import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorStyles, extensions } from "./shared";
import { styled, StyleObject } from "@open-decision/design-system";
import { TRichText } from "./types";

const StyledEditorContent = styled(EditorContent, editorStyles);

type Props = { content: TRichText; css?: StyleObject } & Omit<
  React.ComponentProps<typeof StyledEditorContent>,
  "editor" | "content"
>;

export function RichTextRenderer({ content, ...props }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return (
    <StyledEditorContent
      data-test="richTextEditor"
      editor={editor}
      {...props}
    />
  );
}
