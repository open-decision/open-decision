import * as React from "react";
import { EditorContent, EditorContentProps, useEditor } from "@tiptap/react";
import { extensions } from "./shared";
import { TRichText } from "./types";
import styles from "./RichTextEditor.module.css";

type Props = { content: TRichText; className?: string } & Omit<
  EditorContentProps,
  "editor" | "content" | "ref"
>;

export function RichTextRenderer({ content, className, ...props }: Props) {
  const editor = useEditor({ extensions, content, editable: false });

  return (
    <EditorContent
      className={`${styles.editor} ${className}`}
      data-test="richTextEditor"
      editor={editor}
      {...props}
    />
  );
}
