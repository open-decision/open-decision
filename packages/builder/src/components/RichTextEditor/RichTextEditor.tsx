import React from "react";
import { Box } from "@open-legal-tech/design-system";
import { Editable, Slate, withReact } from "slate-react";
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

type RichTextEditorProps = React.ComponentProps<typeof Box> & {
  value: Descendant[];
  setValue: (newValue: Descendant[]) => void;
};

export function RichTextEditor({
  css,
  value,
  setValue,
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
    <Box
      css={{
        ...css,
        display: "grid",
        gap: "$2",
        borderRadius: "$md",
        overflow: "hidden",
        border: "1px solid $gray8",
        backgroundColor: "$primary1",
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Toolbar />
        <Box css={{ padding: "$2" }} {...props}>
          <Editable
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
      </Slate>
    </Box>
  );
}
