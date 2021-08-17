import React from "react";
import { Box } from "@open-legal-tech/design-system";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor, Descendant, Editor } from "slate";
import { renderElement } from "./Elements";
import { onKeyDownHandler } from "./formatting";
import { renderLeaf } from "./Leaf";
import { CustomElement } from "./types";
import { Toolbar } from "./Toolbar";

const initialValue: CustomElement[] = [
  { type: "h1", children: [{ text: "This is a Heading" }] },
  { type: "h2", children: [{ text: "This is a smaller Heading" }] },
  { type: "h3", children: [{ text: "This is the smallest Heading" }] },
  { type: "p", children: [{ text: "" }] },
  { type: "p", children: [{ text: "This is normal text" }] },
  {
    type: "p",
    children: [
      {
        text: "This text represents all the currently possible formatting: ",
      },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", " },
      { text: "underline", underline: true },
      { text: "." },
    ],
  },
];

type RichTextEditorProps = React.ComponentProps<typeof Box>;

export function RichTextEditor(props: RichTextEditorProps): JSX.Element {
  const editorRef = React.useRef<Editor>();
  if (!editorRef.current) editorRef.current = withReact(createEditor());
  const editor = editorRef.current;

  const [value, setValue] = React.useState<Descendant[]>(initialValue);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Toolbar />
      <Box
        css={{
          padding: "$4",
          backgroundColor: "white",
        }}
        {...props}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDownHandler(editor)}
        />
      </Box>
    </Slate>
  );
}
