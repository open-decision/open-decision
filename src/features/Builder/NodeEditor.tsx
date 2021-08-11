//External Libraries
import React, { useRef } from "react";

//Hooks and Functions
import { styled } from "@open-legal-tech/design-system";
import {
  isNode,
  Node,
  OnLoadParams,
  ReactFlowProvider,
} from "react-flow-renderer";
import { Stage } from "./Stage";
import {
  NewNodeSidebar,
  NodeEditingSidebar,
  SidebarContent,
  SidebarRoot,
  SidebarToggle,
} from "components";
import { nanoid } from "nanoid/non-secure";
import { pipe } from "fp-ts/lib/function";
import { getElement } from "./utilities/stateFunctions";
import { TElementData } from "./types";
import { createEdge } from "./hooks/createTreeMachine";
import { fold } from "fp-ts/lib/Either";
import { useTree } from "./hooks/useTree";

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
  const [state, send] = useTree();
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

      const newNode = {
        id: nanoid(5),
        type,
        position,
        data: { label: `${type} node` },
      };

      send({ type: "addElement", value: newNode });
    }
  };

  const selectedNode = pipe(
    tree.state.elements,
    getElement(selectedNodeId),
    (el) => (el && isNode(el) ? el : undefined)
  );

  return (
    <Container ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <Stage
          elements={tree.state.elements ?? {}}
          onElementsRemove={(elementsToRemove) =>
            send({ type: "deleteElement", elements: elementsToRemove })
          }
          onConnect={(connection) =>
            pipe(
              connection,
              createEdge(tree.state.elements),
              fold(
                (errors) => console.warn(errors),
                (value) => send({ type: "addElement", value })
              )
            )
          }
          onDragOver={onDragOver}
          onDrop={onDrop}
          onLoad={setReactFlowInstance}
          onElementClick={(_, node) => {
            setNodeEditingSidebarOpen(true);
            setSelectedNodeId(node.id);
          }}
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
          <SidebarContent css={{ width: "clamp(300px, 50vw, 800px)" }}>
            <NodeEditingSidebar
              node={selectedNode}
              setNode={(nodeId: string, newNode: Partial<Node<TElementData>>) =>
                send({
                  type: "updateElement",
                  value: { id: nodeId, data: newNode },
                })
              }
            />
          </SidebarContent>
        </SidebarRoot>
      </ReactFlowProvider>
    </Container>
  );
};
