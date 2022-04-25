import * as React from "react";
import { Content } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorStyles, extensions } from "./shared";
import { styled } from "@open-decision/design-system";

const StyledEditorContent = styled(EditorContent, editorStyles);

type Props = { content: Content };

export function RichTextRenderer({ content }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return <StyledEditorContent editor={editor} />;
}
