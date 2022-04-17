import * as React from "react";
import { Content } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./shared";

type Props = { content: Content };

export function RichTextRenderer({ content }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return <EditorContent editor={editor} />;
}
