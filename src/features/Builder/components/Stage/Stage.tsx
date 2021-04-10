import { Tree } from "features/Builder";
import { useEditorStore, useTreeStore } from "features/Builder/globalState";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useGesture } from "react-use-gesture";
import { CSS, styled } from "utils/stitches.config";
import shallow from "zustand/shallow";
import { ExistingConnection } from "../Connections/ExisitingConnection";
import { Node } from "../Node/Node";

const StageContainer = styled("div", {
  overflow: "hidden",
  outline: "none",
  backgroundColor: "#ffffff",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E\")",
});

type StageProps = {
  tree: Tree;
  /**
   * Setting this to false disables panning in the Editor.
   */
  disablePan: boolean;
  /**
   * Setting this to false disables zooming in the Editor.
   */
  disableZoom: boolean;
  className?: string;
  css?: CSS;
};

/**
 * The Stage is the main parent component of the node-editor. It holds all the Nodes and Connections pased in as children. It's main pourpose is to allow panning and zooming.
 */
export const Stage = ({
  tree,
  disablePan,
  disableZoom,
  css,
}: StageProps): JSX.Element => {
  const [setCoordinates, setZoom, zoom, coordinates] = useEditorStore(
    (state) => [
      state.setCoordinates,
      state.setZoom,
      state.zoom,
      state.coordinates,
    ],
    shallow
  );

  const [setInitialState, nodes, connections, nodeTypes] = useTreeStore(
    (state) => [
      state.setInitialState,
      state.data.nodes,
      state.data.connections,
      state.data.nodeTypes,
    ],
    shallow
  );

  React.useEffect(() => {
    setZoom(tree.state.position.zoom);
    setCoordinates(tree.state.position.coordinates);
    setInitialState({
      nodes: tree.state.nodes,
      nodeTypes: tree.config.nodeTypes,
      portTypes: tree.config.portTypes,
      connections: tree.state.connections,
    });
  }, [setCoordinates, setInitialState, setZoom, tree]);

  /**
   * These gestures represent the panning and zooming inside the Stage. They are enabled and disabled by the `disableZoom` and `disablePan` props.
   */
  const stageGestures = useGesture(
    {
      // We track the mousewheel and zoom in and out of the Stage.
      onWheel: ({ delta: [, y] }) => {
        setZoom(y);
      },
      // We track the drag and pan the Stage based on the previous coordinates and the delta (change) in the coordinates.
      onDrag: ({ movement, buttons, cancel }) => {
        //The panning should not work on right mouse click.
        const isValidClick = buttons === 1 || buttons === 4;

        // We cancel the event when the wrong button has been used. Otherwise we perform the operation
        isValidClick ? setCoordinates(movement) : cancel();
      },
    },
    {
      wheel: { enabled: !disableZoom, axis: "y" },
      drag: { enabled: !disablePan, initial: coordinates },
    }
  );

  //------------------------------------------------------------------------

  return (
    <StageContainer tabIndex={-1} {...stageGestures()} css={css}>
      <motion.div
        transition={{ type: "spring", stiffness: 800, mass: 0.1, damping: 20 }}
        animate={{
          scale: zoom,
          translateX: coordinates[0],
          translateY: coordinates[1],
        }}
      >
        {Object.entries(connections).map(([outputNodeId, connections]) =>
          connections.map((id) => (
            <ExistingConnection
              key={`${outputNodeId}-${id}`}
              output={nodes[outputNodeId]}
              input={nodes[id]}
            />
          ))
        )}
        {Object.values(nodes).map((node) => (
          <Node node={node} config={nodeTypes[node.type]} key={node.id} />
        ))}
      </motion.div>
    </StageContainer>
  );
};
