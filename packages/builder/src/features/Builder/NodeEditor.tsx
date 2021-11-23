import { Button, StyleObject } from "@open-legal-tech/design-system";
import { Sidebar } from "components/Sidebar";
import React from "react";
import { NodeCreator } from "./components/NodeCreator";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { useEditor } from "./state/useEditor";
import { useTree } from "./state/useTree";
import { Canvas } from "./components/Canvas/Canvas";

type NodeEditorProps = {
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const { isNodeEditingSidebarOpen } = useEditor();
  const [state, send] = useTree();

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
        <Button
          variant="tertiary"
          css={{
            colorScheme: "error",
            position: "absolute",
            bottom: "20px",
            left: "20px",
          }}
          //FIXME Needs Confirmation Dialog
          onClick={() => send({ type: "clearTree" })}
        >
          Projekt löschen
        </Button>
      </Canvas>
      <Sidebar
        css={{
          gridRow: "2",
          gridColumn: "2",
        }}
        open={isNodeEditingSidebarOpen}
      >
        {state.context.selectedNodeId ? (
          <NodeEditingSidebar nodeId={state.context.selectedNodeId} />
        ) : (
          <p>Bitte wähle einen Knoten aus</p>
        )}
      </Sidebar>
    </>
  );
};
