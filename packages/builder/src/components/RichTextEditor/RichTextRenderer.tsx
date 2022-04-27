import * as React from "react";
import { Content } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorStyles, extensions } from "./shared";
import { styled, StyleObject } from "@open-decision/design-system";

const StyledEditorContent = styled(EditorContent, editorStyles);

type Props = { content: Content; css?: StyleObject } & Omit<
  React.ComponentProps<typeof StyledEditorContent>,
  "editor"
>;

export function RichTextRenderer({ content, ...props }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return <StyledEditorContent editor={editor} {...props} />;
}
