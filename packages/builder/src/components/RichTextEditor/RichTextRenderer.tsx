import { EditorContent, useEditor } from "@tiptap/react";
import * as React from "react";
import { extensions } from "./shared";

type Props = { content: any };

export function RichTextRenderer({ content }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return <EditorContent editor={editor} />;
}
