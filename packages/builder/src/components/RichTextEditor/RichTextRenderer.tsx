import { EditorContent, useEditor } from "@tiptap/react";
import * as React from "react";
import { extensions } from "./shared";

export function RichTextRenderer(content: any) {
  const editor = useEditor({ extensions, content });

  return <EditorContent editor={editor} />;
}
