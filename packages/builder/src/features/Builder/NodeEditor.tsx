import { StyleObject } from "@open-decision/design-system";
import { Sidebar } from "components/Sidebar";
import React from "react";
import { NodeCreator } from "./components/NodeCreator";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { useSelectedNode } from "./state/treeStore/hooks";

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const selectedNode = useSelectedNode();

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
      </Canvas>
      <Sidebar
        css={{
          gridRow: "2",
          gridColumn: "2",
          groupColor: "$gray11",
          layer: "1",
        }}
        open={selectedNode != null}
      >
        <NodeEditingSidebar key={selectedNode?.id} />
      </Sidebar>
    </>
  );
};
