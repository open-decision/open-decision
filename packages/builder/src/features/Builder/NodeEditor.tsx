import { StyleObject } from "@open-legal-tech/design-system";
import { Sidebar } from "components/Sidebar";
import React from "react";
import { NodeCreator } from "./components/NodeCreator";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { useSelectedNode } from "./state/useNode";
import { SyncIndicator } from "./components/Canvas/SyncIndicator";

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const selectedNode = useSelectedNode();

  const sidebarOpen = selectedNode != null;

  return (
    <>
      <Canvas css={css}>
        <NodeCreator
          css={{
            position: "absolute",
            top: "20px",
            left: "$space$4",
          }}
        />
        <SyncIndicator />
      </Canvas>
      <Sidebar
        css={{
          gridRow: "2",
          gridColumn: "2",
        }}
        open={sidebarOpen}
      >
        {sidebarOpen ? (
          <NodeEditingSidebar node={selectedNode} key={selectedNode.id} />
        ) : null}
      </Sidebar>
    </>
  );
};
