import { styled, StyleObject } from "@open-decision/design-system";
import React from "react";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { sidebarWidth } from "./utilities/constants";

const StyledCanvas = styled(Canvas, {
  display: "grid",
  gridTemplateRows: "max-content 1fr",
  gridTemplateColumns: `1fr ${sidebarWidth}px`,
  justifyItems: "center",
  overflow: "hidden",
});

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  return (
    <StyledCanvas css={css}>
      <Toolbar
        css={{
          isolation: "isolate",
          gridColumn: "1",
          gridRow: "1",
          marginBlockStart: "20px",
        }}
      />
      <NodeEditingSidebar />
    </StyledCanvas>
  );
};
