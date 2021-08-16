import { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "unset",
      }}
    >
      {props.children}
    </span>
  );
};

export const renderLeaf = (props: RenderLeafProps): JSX.Element => {
  return <Leaf {...props} />;
};
