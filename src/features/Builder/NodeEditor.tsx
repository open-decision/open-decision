//External Libraries
import React, { useRef } from "react";

//Hooks and Functions
import { styled } from "@open-legal-tech/design-system";
import { OnLoadParams, ReactFlowProvider } from "react-flow-renderer";
import { Stage } from "./Stage";
import { SidebarContent, SidebarRoot, SidebarToggle } from "components/Sidebar";
import { nanoid } from "nanoid/non-secure";
import { pipe } from "fp-ts/lib/function";
import { createEdge } from "./hooks/createTreeMachine";
import { fold } from "fp-ts/lib/Either";
import { useTree } from "./hooks/useTree";
import { useActor } from "@xstate/react";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { NewNodeSidebar } from "./components/NewNodeSidebar";

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

export const NodeEditor: React.FC<NodeEditorProps> = () => {
  const service = useTree();
  const [state, send] = useActor(service);
  const tree = state.context.tree;

  const [isNodeEditingSidebarOpen, setNodeEditingSidebarOpen] =
    React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState("");
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<OnLoadParams<any> | null>(null);

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
          data: { label: `${type} node` },
          content: { inputs: [], content: [] },
        },
      });
    }
  };

  const selectedNode = tree.state.elements.nodes[selectedNodeId];
  const elements = [
    ...Object.values(tree.state.elements.nodes),
    ...Object.values(tree.state.elements.edges),
  ];

  return (
    <Container ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <Stage
          elements={elements}
          onElementsRemove={(elementsToRemove) =>
            send({
              type: "deleteNode",
              ids: elementsToRemove.map((element) => element.id),
            })
          }
          onConnect={(connection) =>
            pipe(
              connection,
              createEdge(tree.state.elements),
              fold(
                (errors) => console.warn(errors),
                (value) => send({ type: "addEdge", value })
              )
            )
          }
          onDragOver={onDragOver}
          onDrop={onDrop}
          onLoad={setReactFlowInstance}
          onElementClick={(_event, node) => {
            setNodeEditingSidebarOpen(true);
            setSelectedNodeId(node.id);
          }}
          onNodeDragStop={(_event, node) =>
            send({ type: "updateNode", value: { id: node.id, data: node } })
          }
          style={{ gridColumn: "1 / -1", gridRow: "1" }}
        />
        <SidebarRoot
          css={{
            gridColumn: "1 / 2",
            gridRow: "1",
            overflowY: "auto",
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
            overflowY: "auto",
            zIndex: 5,
          }}
          open={isNodeEditingSidebarOpen}
          onOpenChange={(open: boolean) =>
            open
              ? setNodeEditingSidebarOpen(open)
              : setNodeEditingSidebarOpen(false)
          }
        >
          <SidebarToggle position="right" />
          <SidebarContent css={{ width: "clamp(300px, 50vw, 700px)" }}>
            <NodeEditingSidebar selectedNodeId={selectedNodeId} />
          </SidebarContent>
        </SidebarRoot>
      </ReactFlowProvider>
    </Container>
  );
};
