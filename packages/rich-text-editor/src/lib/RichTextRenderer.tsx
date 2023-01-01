import * as React from "react";
import { EditorContent, EditorContentProps, useEditor } from "@tiptap/react";
import { editorClasses, extensions } from "./shared";
import { TRichText } from "./types";

type Props = { content: TRichText; className?: string } & Omit<
  EditorContentProps,
  "editor" | "content" | "ref"
>;

export function RichTextRenderer({ content, className, ...props }: Props) {
  const editor = useEditor({
    editorProps: { attributes: { class: editorClasses } },
    extensions,
    content,
    editable: false,
  });

  return (
    <EditorContent
      className={`${className}`}
      data-test="richTextEditor"
      editor={editor}
      {...props}
    />
  );
}
