import * as React from "react";
import { useReactFlow, useStore } from "reactflow";
import { calculateCenterOfNode } from "../utils/calculateCenterOfNode";
import { sidebarWidth } from "../utils/constants";
import { ODProgrammerError } from "@open-decision/type-classes";
import { Node, TEdgeId, TNodeId, TTreeClient } from "@open-decision/tree-type";
import shallow from "zustand/shallow";
import { proxy } from "valtio";
import { useTreeClient } from "@open-decision/tree-sync";
import { useUnmount } from "react-use";

type EditorStore = {
  connectionSourceNodeId?: TNodeId;
  validConnections: TNodeId[];
  selectedNodeIds: TNodeId[];
  selectedEdgeIds: TEdgeId[];
};

const createSelectionMethods = (
  treeClient: TTreeClient,
  editorStore: EditorStore
) => {
  function startConnecting(sourceNodeId: TNodeId) {
    const connectionOriginNode = treeClient.nodes.get.single(sourceNodeId);
    if (!connectionOriginNode) return;

    editorStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = treeClient.nodes.get.connectableNodes(
      connectionOriginNode.id
    );

    editorStore.validConnections = validConnections;
  }

  function abortConnecting() {
    delete editorStore.connectionSourceNodeId;
    editorStore.validConnections = [];
  }

  function addSelectedNodes(nodeIds: TNodeId[]) {
    editorStore.selectedNodeIds.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: TNodeId[]) {
    editorStore.selectedNodeIds = nodeIds;
  }

  function removeSelectedNodes() {
    editorStore.selectedNodeIds = [];
  }

  function removeSelectedNode(nodeId: string) {
    const nodeIndex = editorStore.selectedNodeIds.findIndex(
      (id) => id === nodeId
    );
    editorStore.selectedNodeIds.splice(nodeIndex, 1);
  }
  function addSelectedEdges(edgeIds: TEdgeId[]) {
    editorStore.selectedEdgeIds.push(...edgeIds);
  }

  function replaceSelectedEdges(edgeIds: TEdgeId[]) {
    editorStore.selectedEdgeIds = edgeIds;
  }

  function removeSelectedEdges() {
    editorStore.selectedEdgeIds = [];
  }

  function removeSelectedEdge(edgeId: string) {
    const edgeIndex = editorStore.selectedEdgeIds.findIndex(
      (id) => id === edgeId
    );
    editorStore.selectedEdgeIds.splice(edgeIndex, 1);
  }

  return {
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
  | ((EditorState & ReturnType<typeof createSelectionMethods>) & {
      editorStore: EditorStore;
    })
  | null
>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;

const editorStore = proxy<{
  connectionSourceNodeId?: TNodeId;
  validConnections: TNodeId[];
  selectedNodeIds: TNodeId[];
  selectedEdgeIds: TEdgeId[];
}>({
  validConnections: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
});

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

  const selectionFunctions = React.useMemo(() => {
    return createSelectionMethods(treeClient, editorStore);
  }, [treeClient]);

  useUnmount(() => {
    delete editorStore.connectionSourceNodeId;
    editorStore.selectedEdgeIds = [];
    editorStore.selectedNodeIds = [];
    editorStore.validConnections = [];
  });

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
        editorStore,
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
