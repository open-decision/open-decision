import React from "react";
import { Box, BoxProps } from "@open-legal-tech/design-system";
import {
  Editable as SlateEditable,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { createEditor, Descendant, Editor } from "slate";
import { renderElement } from "./Elements";
import { renderLeaf } from "./Leaf";
import { Toolbar } from "./Toolbar";
import { onKeyDownHandler } from "./keyboardShortcuts";
import { withInlines } from "./editorConfig";

const initialValues: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];

type RichTextEditorProps = Omit<BoxProps, "setValue"> & {
  value: Descendant[];
  setValue: (newValue: Descendant[]) => void;
  children: React.ReactNode;
};

function Root({
  value,
  setValue,
  children,
  ...props
}: RichTextEditorProps): JSX.Element {
  const editorRef = React.useRef<Editor>();
  if (!editorRef.current)
    editorRef.current = withInlines(withReact(createEditor()));
  const editor = editorRef.current;

  // Slate does not accept an empty array. Since an empty array does not count as undefined we
  // cannot use the default value in the props destructuring.
  if (value.length <= 0) value = initialValues;
  editor.children = value;

  return (
    <Box {...props}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        {children}
      </Slate>
    </Box>
  );
}

function Editable(props: BoxProps) {
  const editor = useSlate();

  return (
    <Box css={{ padding: "$2" }} {...props}>
      <SlateEditable
        style={{
          minHeight: "200px",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDownHandler(editor)}
      />
    </Box>
  );
}

export const RichTextEditor = { Root, Editable, Toolbar };
