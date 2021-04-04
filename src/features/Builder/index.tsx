//External Libraries
import React from "react";

//Components
import { Stage } from "./components/Stage/Stage";

//Hooks and Functions
import { useEdgesStore, useEditorStore, useNodesStore } from "./globalState";
import { Nodes } from "./components/Node/Nodes";
import { ConnectionsWrapper } from "./components/Connections/ConnectionsWrapper";
import { coordinates, edges, nodes, nodeTypes, portTypes } from "./types";
import shallow from "zustand/shallow";
import { NewNodeSidebar } from "./components/Sidebar/NewNodeSidebar";
import { NodeEditingSidebar } from "./components/Sidebar/NodeEditingSidebar";

export type Tree = {
  config: {
    /**
     * The preconfigured avaliable NodeTypes that are avaliable in the node-editor.
     */
    nodeTypes: nodeTypes;
    /**
     * The preconfigured avaliable NodeTypes that are avaliable in the node-editor.
     */
    portTypes: portTypes;
  };
  state: {
    treeName: string;
    position: {
      /**
       * The current zoom level.
       */
      zoom: number;
      /**
       * The current position of the Editor.
       */
      coordinates: coordinates;
    };
    /**
     * The currently shown Nodes.
     */
    nodes: nodes;
    /**
     * The currently shown Nodes.
     */
    edges: edges;
  };
};

type NodeEditorProps = {
  /**
   * The id of the Tree.
   */
  tree: Tree;
  /**
   * Zooming can be disabled. False by default.
   */
  disableZoom?: boolean;
  /**
   * Panning can be disabled. False by default.
   */
  disablePan?: boolean;
};

export const NodeEditor: React.FC<NodeEditorProps> = ({
  tree,
  disableZoom = false,
  disablePan = false,
}) => {
  const [setCoordinates, setZoom] = useEditorStore(
    (state) => [state.setCoordinates, state.setZoom],
    shallow
  );
  const setNodes = useNodesStore((state) => state.setNodes, shallow);
  const setEdges = useEdgesStore((state) => state.setEdges, shallow);

  React.useEffect(() => {
    setZoom(tree.state.position.zoom);
    setCoordinates(tree.state.position.coordinates);
    setNodes(tree.state.nodes, tree.config.nodeTypes, tree.config.portTypes);
    setEdges(tree.state.edges);
  }, [setCoordinates, setEdges, setNodes, setZoom, tree]);

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
