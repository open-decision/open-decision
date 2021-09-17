import React from "react";
import { Box } from "@open-legal-tech/design-system";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor, Descendant, Editor } from "slate";
import { renderElement } from "./Elements";
import { onKeyDownHandler } from "./formatting";
import { renderLeaf } from "./Leaf";
import { Toolbar } from "./Toolbar";

const initialValues: Descendant[] = [
  {
    type: "p",
    children: [{ text: "" }],
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
  if (!editorRef.current) editorRef.current = withReact(createEditor());
  const editor = editorRef.current;

  // Slate does not accept an empty array. Since an empty array does not count as undefined we
  // cannot use the default value in the props destructuring.
  if (value.length <= 0) value = initialValues;

  return (
    <Box css={{ css }}>
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
    </Box>
  );
}
