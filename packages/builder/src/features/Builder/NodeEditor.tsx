import { styled, StyleObject } from "@open-decision/design-system";
import { Sidebar } from "components/Sidebar";
import React from "react";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { useSelectedNodes } from "./state/treeStore/hooks";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { sidebarWidth } from "./utilities/constants";

const StyledCanvas = styled(Canvas, {
  display: "grid",
  gridTemplateRows: "max-content 1fr",
  gridTemplateColumns: `1fr ${sidebarWidth}px`,
  justifyItems: "center",
});

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const [selectionStatus, selectedNode] = useSelectedNodes();

  const sidebarIsOpen = selectionStatus === "single";

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
      <Sidebar
        css={{
          gridRow: "1 / -1",
          gridColumn: "2",
          groupColor: "$gray11",
          layer: "1",
          width: "100%",
        }}
        open={sidebarIsOpen}
      >
        {selectionStatus === "single" ? (
          <NodeEditingSidebar node={selectedNode[0]} key={selectedNode[0].id} />
        ) : null}
      </Sidebar>
    </StyledCanvas>
  );
};
