import { styled, StyleObject } from "@open-decision/design-system";
import { Canvas } from "./Canvas/Canvas";
import { sidebarWidth } from "./utils/constants";
import { ZoomInOut } from "./Canvas/ZoomInOut";
import { NodeTypes } from "react-flow-renderer";

const StyledCanvas = styled(Canvas, {
  display: "grid",
  gridTemplateColumns: `1fr ${sidebarWidth}px`,
  justifyItems: "center",
  height: "100%",
  overflow: "hidden",
});

type NodeEditorProps = {
  css?: StyleObject;
  NodeSidebarPlugin: React.ReactNode;
  nodeTypes: NodeTypes;
};

export const NodeEditor = ({
  css,
  NodeSidebarPlugin,
  nodeTypes,
}: NodeEditorProps) => {
  return (
    <StyledCanvas css={css} nodeTypes={nodeTypes}>
      <ZoomInOut css={{ position: "absolute", bottom: 10, left: 10 }} />
      {NodeSidebarPlugin}
    </StyledCanvas>
  );
};
