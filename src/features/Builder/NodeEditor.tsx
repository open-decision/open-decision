//External Libraries
//Hooks and Functions
import { styled } from "@open-legal-tech/design-system";
import { useActor } from "@xstate/react";
import { SidebarContent, SidebarRoot, SidebarToggle } from "components/Sidebar";
import { nanoid } from "nanoid/non-secure";
import React, { useRef } from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { NewNodeSidebar } from "./components/NewNodeSidebar";
import { Node } from "./components/Node";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { Stage } from "./Stage";
import { EditorProvider, useEditor } from "./state/useEditor";
import { TreeProvider, useTree } from "./state/useTree";

const Container = styled("div", {
  display: "grid",
  gridTemplateColumns: "max-content 1fr max-content",
  flexGrow: 1,
  height: "100%",
  width: "100vw",
});

type NodeEditorProps = {
  /**
   * Zooming can be disabled. False by default.
   */
  disableZoom?: boolean;
  /**
   * Panning can be disabled. False by default.
   */
  disablePan?: boolean;
};

const Editor: React.FC<NodeEditorProps> = () => {
  const service = useTree();
  const [state, send] = useActor(service);
  const tree = state.context;

  const {
    selectedNodeId,
    setSelectedNodeId,
    reactFlowInstance,
    setReactFlowInstance,
    isNodeEditingSidebarOpen,
    setNodeEditingSidebarOpen,
  } = useEditor();

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  if (state.matches("pending")) {
    return <div>Loading</div>;
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");

    if (reactFlowWrapper.current && reactFlowInstance && type) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      send({
        type: "addNode",
        value: {
          id: nanoid(5),
          type,
          position,
          data: { label: `${type} node`, inputs: {}, content: [] },
        },
      });
    }
  };

  const elements = [...Object.values(tree.nodes), ...Object.values(tree.edges)];

  return (
    <Container ref={reactFlowWrapper}>
      <Stage
        nodeTypes={{ default: Node }}
        elements={elements}
        onElementsRemove={(elementsToRemove) =>
          send([
            {
              type: "deleteNode",
              ids: elementsToRemove.map((element) => element.id),
            },
            {
              type: "deleteEdge",
              ids: elementsToRemove.map((element) => element.id),
            },
          ])
        }
        onConnect={({ source, target }) =>
          source && target
            ? send({
                type: "addEdge",
                connection: { source, target, inputs: [] },
              })
            : null
        }
        onDragOver={onDragOver}
        onDrop={onDrop}
        onLoad={setReactFlowInstance}
        onElementClick={(_event, node) => {
          setNodeEditingSidebarOpen(true);
          setSelectedNodeId(node.id);
        }}
        onNodeDragStop={(_event, node) =>
          send({ type: "updateNode", id: node.id, node })
        }
        style={{
          gridColumn: "1 / -1",
          gridRow: "1",
        }}
      />
      <SidebarRoot
        css={{
          gridColumn: "1 / 2",
          gridRow: "1",
          zIndex: 5,
        }}
      >
        <SidebarContent>
          <NewNodeSidebar nodeTypes={tree.config.nodeTypes} />
        </SidebarContent>
        <SidebarToggle />
      </SidebarRoot>
      <SidebarRoot
        css={{
          gridColumn: "3 / 4",
          gridRow: "1",
          zIndex: 5,
        }}
        open={isNodeEditingSidebarOpen}
        onOpenChange={(newOpenState = false) =>
          setNodeEditingSidebarOpen(newOpenState)
        }
      >
        <SidebarToggle position="right" />
        <SidebarContent>
          <NodeEditingSidebar id={selectedNodeId} />
        </SidebarContent>
      </SidebarRoot>
    </Container>
  );
};

export function NodeEditor() {
  return (
    <ReactFlowProvider>
      <TreeProvider>
        <EditorProvider>
          <Editor />
        </EditorProvider>
      </TreeProvider>
    </ReactFlowProvider>
  );
}
