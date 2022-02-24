import { StyleObject } from "@open-legal-tech/design-system";
import { Sidebar } from "components/Sidebar";
import React from "react";
import { NodeCreator } from "./components/NodeCreator";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { UndoRedo } from "./components/Canvas/UndoRedo";
import { useSelectedNode } from "./state/treeStore/hooks";

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
            top: "$space$4",
            left: "$space$4",
          }}
        />
        {/* <UndoRedo /> */}
      </Canvas>
      <Sidebar
        css={{
          gridRow: "2",
          gridColumn: "2",
          groupColor: "$gray11",
          layer: "1",
        }}
        open={sidebarOpen}
      >
        {sidebarOpen ? (
          <NodeEditingSidebar
            node={Object.assign({}, selectedNode)}
            key={selectedNode.id}
          />
        ) : null}
      </Sidebar>
    </>
  );
};
