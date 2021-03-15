//External Libraries
import React from "react";

//Components
import { Stage } from "./components/Stage/Stage";

//Hooks and Functions
import { useEdgesStore, useEditorStore, useNodesStore } from "./globalState";
import { Nodes } from "./components/Node/Nodes";
import { ConnectionsWrapper } from "./components/Connections/ConnectionsWrapper";
import {
  comments,
  coordinates,
  edges,
  nodes,
  nodeTypes,
  portTypes,
} from "./types";
import shallow from "zustand/shallow";
import { NewNodeSidebar } from "./components/Sidebar/NewNodeSidebar";
import {
  NodeEditingSidebar,
  useSidebarState,
} from "./components/Sidebar/NodeEditingSidebar";

export type EditorState = {
  /**
   * The id of the Editor.
   */
  id: string;
  /**
   * The current zoom level.
   */
  zoom: number;
  /**
   * The current position of the Editor.
   */
  coordinates: coordinates;
  /**
   * The currently shown Nodes.
   */
  nodes: nodes;
  /**
   * The currently shown Nodes.
   */
  edges: edges;
  /**
   * The currently shown Comments.
   */
  comments: comments;
  /**
   * The preconfigured avaliable NodeTypes and PortTypes that can be added when using the node-editor.
   */
  nodeTypes: nodeTypes;
  portTypes: portTypes;
  treeName: string;
};

type NodeEditorProps = {
  /**
   * The state of the content in the Editor.
   */
  state: EditorState;
  setState?: (value: EditorState) => void;
  /**
   * Zooming can be disabled. False by default.
   */
  disableZoom?: boolean;
  /**
   * Panning can be disabled. False by default.
   */
  disablePan?: boolean;
  /**
   * The Editor can make sure, that circular connections between nodes are not possible. By default circular connections are prevented.
   */
  circularBehavior?: "prevent" | "warn" | "allow";
  debug?: boolean;
  /**
   * The zoom of the Editor. Ranges from 0.1 to 7.
   */
  zoom?: number;
  /**
   * Comments can be hidden dynamically. False by default.
   */
  hideComments?: boolean;
};

export const NodeEditor: React.FC<NodeEditorProps> = ({
  state,
  disableZoom = false,
  disablePan = false,
}) => {
  const [setCoordinates, setZoom] = useEditorStore(
    (state) => [state.setCoordinates, state.setZoom],
    shallow
  );

  const setNodes = useNodesStore((state) => state.setNodes, shallow);
  const setEdges = useEdgesStore((state) => state.setEdges, shallow);

  const isSidebarOpen = useSidebarState((state) => state.open);

  React.useEffect(() => {
    setZoom(state.zoom);
    setCoordinates(state.coordinates);

    setNodes(state.nodes, state.nodeTypes, state.portTypes);
    setEdges(state.edges);
  }, [
    setCoordinates,
    setEdges,
    setNodes,
    setZoom,
    state.coordinates,
    state.edges,
    state.nodeTypes,
    state.nodes,
    state.portTypes,
    state.zoom,
  ]);

  //----------------------------------------------------------------

  return (
    <div
      className="w-full h-full grid"
      style={{
        gridTemplateColumns: "max-content 4fr 1fr",
        gridTemplateRows: "1fr",
        overflow: "hidden",
      }}
    >
      <Stage
        disablePan={disablePan}
        disableZoom={disableZoom}
        style={{ gridColumn: "1 / -1", gridRow: "1" }}
      >
        <ConnectionsWrapper />
        <Nodes />
      </Stage>
      <NewNodeSidebar css={{ gridColumn: "1 / 2", gridRow: "1" }} />
      <NodeEditingSidebar css={{ gridColumn: "3 / 4", gridRow: "1" }} />
    </div>
  );
};
