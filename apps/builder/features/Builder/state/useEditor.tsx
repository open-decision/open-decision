import * as React from "react";
import { useReactFlow, useStore } from "react-flow-renderer";
import { calculateCenterOfNode } from "../utilities/calculateCenterOfNode";
import { sidebarWidth } from "../utilities/constants";
import { Node, ODProgrammerError } from "@open-decision/type-classes";
import shallow from "zustand/shallow";
import { useTreeClient, useTreeContext } from "./treeStore/TreeContext";
import { TTreeClient } from "@open-decision/tree-client";

const createSelectionMethods = (
  treeClient: TTreeClient,
  nonSyncedStore: ReturnType<typeof useTreeContext>["tree"]["nonSyncedStore"]
) => {
  const updateSelectedView = (view: string) => {
    nonSyncedStore.selectedView = view;
  };

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = treeClient.nodes.get.single(sourceNodeId);
    if (!connectionOriginNode) return;

    nonSyncedStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = treeClient.nodes.get.connectableNodes(
      connectionOriginNode.id
    );

    nonSyncedStore.validConnections = validConnections;
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  function addSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selectedNodeIds.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selectedNodeIds = nodeIds;
  }

  function removeSelectedNodes() {
    nonSyncedStore.selectedNodeIds = [];
  }

  function removeSelectedNode(nodeId: string) {
    const nodeIndex = nonSyncedStore.selectedNodeIds.findIndex(
      (id) => id === nodeId
    );
    nonSyncedStore.selectedNodeIds.splice(nodeIndex, 1);
  }
  function addSelectedEdges(edgeIds: string[]) {
    nonSyncedStore.selectedEdgeIds.push(...edgeIds);
  }

  function replaceSelectedEdges(edgeIds: string[]) {
    nonSyncedStore.selectedEdgeIds = edgeIds;
  }

  function removeSelectedEdges() {
    nonSyncedStore.selectedEdgeIds = [];
  }

  function removeSelectedEdge(edgeId: string) {
    const edgeIndex = nonSyncedStore.selectedEdgeIds.findIndex(
      (id) => id === edgeId
    );
    nonSyncedStore.selectedEdgeIds.splice(edgeIndex, 1);
  }

  return {
    updateSelectedView,
    abortConnecting,
    startConnecting,
    addSelectedNodes,
    replaceSelectedEdges,
    replaceSelectedNodes,
    removeSelectedEdge,
    removeSelectedEdges,
    removeSelectedNode,
    removeSelectedNodes,
    addSelectedEdges,
  };
};

type projectCoordinatesFn = (
  coordinates: Node.TCoordinates
) => Node.TCoordinates | undefined;

type EditorState = {
  getCenter: () => Node.TCoordinates | undefined;
  projectCoordinates: projectCoordinatesFn;
  reactFlowWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  closeNodeEditingSidebar: () => void;
  zoomToNode: (node: Node.TNode) => void;
  connectingNodeId: string | null;
  isConnecting: boolean;
};

export const EditorContext = React.createContext<
  (EditorState & ReturnType<typeof createSelectionMethods>) | null
>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const reactFlowWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();
  const connectionState = useStore(
    (state) => ({
      connectingNodeId: state.connectionNodeId,
      isConnecting: state.connectionNodeId != null ? true : false,
    }),
    shallow
  );
  const userSelectionActive = useStore((state) => state.userSelectionActive);
  const multiSelectionActive = useStore((state) => state.multiSelectionActive);

  const { project, setCenter, getZoom } = useReactFlow();

  const getCenter = () => {
    if (!reactFlowBounds) return undefined;

    return project({
      x: reactFlowBounds.width / 2,
      y: reactFlowBounds.height / 2,
    });
  };

  const projectCoordinates: projectCoordinatesFn = (coordinates) => {
    if (!reactFlowBounds) return undefined;

    return project({
      x: coordinates.x - reactFlowBounds.left,
      y: coordinates.y - reactFlowBounds.top,
    });
  };

  function zoomToNode(node: Node.TNode) {
    if (userSelectionActive || multiSelectionActive) return;
    const positionOfNodeFromCenter = calculateCenterOfNode(
      node.position,
      node.id ? { x: sidebarWidth / 2, y: 0 } : undefined
    );

    setCenter?.(positionOfNodeFromCenter.x, positionOfNodeFromCenter.y, {
      zoom: getZoom(),
      duration: 1000,
    });
  }

  const treeClient = useTreeClient();
  const {
    tree: { nonSyncedStore },
  } = useTreeContext();

  const selectionFunctions = React.useMemo(() => {
    return createSelectionMethods(treeClient, nonSyncedStore);
  }, [nonSyncedStore, treeClient]);

  return (
    <EditorContext.Provider
      value={{
        projectCoordinates,
        getCenter,
        reactFlowWrapperRef,
        closeNodeEditingSidebar: () => selectionFunctions.removeSelectedNodes(),
        zoomToNode,
        ...selectionFunctions,
        ...connectionState,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = React.useContext(EditorContext);

  if (!editorContext) {
    throw new ODProgrammerError({
      code: "MISSING_CONTEXT_PROVIDER",
      message: "useEditor can only be used inside of an EditorProvider",
    });
  }

  return editorContext;
}
