import React from "react";
import { useGesture } from "react-use-gesture";
import { useEditorStore, useTreeStore } from "../../globalState";
import shallow from "zustand/shallow";
import { ChatOutline, PlusOutline } from "@graywolfai/react-heroicons";
import { Port } from "./Port";
import clsx from "clsx";
import { NewNodeMenu } from "./NewNodeMenu";
import { Trigger } from "@radix-ui/react-dropdown-menu";
import { useNodeEditingSidebarState } from "../Sidebar/NodeEditingSidebar";
import { node, nodeConfig } from "features/Builder/types";

type NodeProps = {
  node: node;
  config: nodeConfig;
};

export const Node: React.FC<NodeProps> = React.memo(({ node, config }) => {
  /**
   * Read this first!
   * All elements of the Node have to contain the data-id={id} attribute.
   * This is needed for the creation of new connections. They use this attribute on
   * the target of the creation gesture.
   */

  //-----------------------------------------------------------------------

  const [setNode] = useTreeStore((state) => [state.setNode], shallow);

  const zoom = useEditorStore((state) => state.zoom);
  const [dragging, setDragging] = React.useState(false);
  const openSidebar = useNodeEditingSidebarState((state) => state.openSidebar);

  //-----------------------------------------------------------------------
  /**
   * This is the drag gesture of the node. It updates the Node state when the Node is dragged.
   * The initial start position of the Node come from the coordinates in the nodes state.
   * We transform the data produced by the drag operation by dividing it with the editor zoom.
   * This makes sure that we keep the Node under the mouse when dragging.
   */
  const nodeGestures = useGesture(
    {
      onDragStart: () => setDragging(true),
      onDrag: ({ movement, event, tap }) => {
        event.stopPropagation();
        if (!tap) setNode({ ...node, coordinates: movement });
      },
      onDragEnd: () => setDragging(false),
      onPointerDown: ({ event }) => event.stopPropagation(),
    },
    {
      drag: {
        initial: node.coordinates,
        transform: ([x, y]) => [x / zoom, y / zoom],
        filterTaps: true,
      },
    }
  );

  const [open, setOpen] = React.useState(false);

  return (
    <div
      style={{
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
        gridTemplateColumns: `10px 10px ${config.width - 40}px 10px 10px`,
        gridTemplateRows: config.height,
      }}
      className={clsx("absolute left-0 top-0 grid", dragging && "z-50")}
      data-id={node.id}
    >
      <button
        className={clsx(
          "bg-gray-100 rounded shadow-lg flex flex-col select-none border-l-4 hover:shadow-xl transition-shadow duration-200 col-start-2 col-end-5 row-span-full",
          dragging ? "opacity-100" : "opacity-80"
        )}
        style={{ borderLeftColor: config.color ?? "gray" }}
        onClick={() => openSidebar(node.id, node.type)}
        {...nodeGestures()}
        data-id={node.id}
      >
        <div className="p-1 flex items-center" data-id={node.id}>
          <ChatOutline
            style={{ width: "2.5em", color: config.color ?? "black" }}
            className="mr-2 rounded py-4 px-2"
            data-id={node.id}
          />
          <h2 data-id={node.id} className="font-semibold flex-1 text-left">
            {node.name}
          </h2>
        </div>
      </button>
      {/* These are the Ports of the Nodes. There is only one Port on each side. */}
      <Port
        nodeId={node.id}
        className="col-start-1 col-end-3 row-span-full self-center justify-self-center"
        variant="connected"
        type="input"
        data-id={node.id}
      />
      {/* If the Outputport is unconnected a dropdown menu is rendered instead. This menu contains all the Nodes that can be added.
       Above we get the outputConnections and here we use them to decide which port to render. */}
      {dragging ? (
        <Port
          nodeId={node.id}
          className="col-start-4 col-end-6 row-span-full self-center justify-self-center"
          variant="connected"
          type="output"
        />
      ) : (
        <NewNodeMenu
          node={node}
          open={open}
          onOpenChange={setOpen}
          data-id={node.id}
        >
          <Trigger
            className="col-start-4 col-end-6 row-span-full self-center justify-self-center z-10"
            data-id={node.id}
          >
            {/* We have to manually control the opening of the Menu when the Port is clicked,
            because the Port has the PointerDown handler attached that enables the creation of a new connection. */}
            <Port
              nodeId={node.id}
              variant="unconnected"
              type="output"
              onClick={() => setOpen(!open)}
              data-id={node.id}
            >
              <PlusOutline className="text-white w-full" data-id={node.id} />
            </Port>
          </Trigger>
        </NewNodeMenu>
      )}
    </div>
  );
});
