import React from "react";
import { styled } from "@open-legal-tech/design-system";
import {
  Editable as SlateEditable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { createEditor, Descendant, Editor } from "slate";
import { renderElement as defaultRenderElement } from "./Elements";
import { renderLeaf as defaultRenderLeaf } from "./Leaf";
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

type RichTextEditorProps = {
  value: Descendant[];
  setValue: (newValue: Descendant[]) => void;
  children: React.ReactNode;
};

function Root({ value, setValue, children }: RichTextEditorProps): JSX.Element {
  const editorRef = React.useRef<Editor>();
  if (!editorRef.current)
    editorRef.current = withInlines(withReact(createEditor()));
  const editor = editorRef.current;

  // Slate does not accept an empty array. Since an empty array does not count as undefined we
  // cannot use the default value in the props destructuring.
  if (value.length <= 0) value = initialValues;
  editor.children = value;

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      {children}
    </Slate>
  );
}

const StyledEditable = styled(SlateEditable, {
  minHeight: "200px !important",
  gap: "10px",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  maxHeight: "100%",
  borderRadius: "$md",
});

type EditableProps = {
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
} & React.ComponentProps<typeof StyledEditable>;

function Editable({
  renderElement = defaultRenderElement,
  renderLeaf = defaultRenderLeaf,
  css,
  ...props
}: EditableProps) {
  const editor = useSlate();

  return (
    <StyledEditable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={onKeyDownHandler(editor)}
      css={css}
      {...props}
    />
  );
}

export const RichTextEditor = { Root, Editable, Toolbar };
