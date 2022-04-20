import { styled, StyleObject } from "@open-decision/design-system";
import React from "react";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { sidebarWidth } from "./utilities/constants";
import { useTreeContext } from "./state/treeStore/TreeContext";
import { useSnapshot } from "valtio";
import { ZoomInOut } from "./components/Canvas/ZoomInOut";

const StyledCanvas = styled(Canvas, {
  display: "grid",
  gridTemplateColumns: `1fr ${sidebarWidth}px`,
  justifyItems: "center",
  overflow: "hidden",
});

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const { tree } = useTreeContext();
  const {
    nonSyncedStore: { synced: _synced },
  } = useSnapshot(tree);

  return (
    <StyledCanvas css={css}>
      <ZoomInOut css={{ position: "absolute", bottom: 10, left: 10 }} />
      <NodeEditingSidebar />
    </StyledCanvas>
  );
};
