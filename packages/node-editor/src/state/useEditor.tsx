import * as React from "react";
import { useReactFlow, useStore } from "reactflow";
import { calculateCenterOfNode } from "../utils/calculateCenterOfNode";
import { sidebarWidth } from "../utils/constants";
import { ODProgrammerError } from "@open-decision/type-classes";
import { Node, TTreeClient } from "@open-decision/tree-type";
import shallow from "zustand/shallow";
import { proxy } from "valtio";
import { useTreeClient } from "@open-decision/tree-sync";

const editorInitialStore = {
  connectionSourceNodeId: "",
  validConnections: [] as string[],
  selectedNodeIds: [] as string[],
  selectedEdgeIds: [] as string[],
  selectedView: "editor",
};

const createSelectionMethods = (
  treeClient: TTreeClient,
  editorStore: typeof editorInitialStore
) => {
  const updateSelectedView = (view: string) => {
    editorStore.selectedView = view;
  };

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = treeClient.nodes.get.single(sourceNodeId);
    if (!connectionOriginNode) return;

    editorStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = treeClient.nodes.get.connectableNodes(
      connectionOriginNode.id
    );

    editorStore.validConnections = validConnections;
  }

  function abortConnecting() {
    editorStore.connectionSourceNodeId = "";
    editorStore.validConnections = [];
  }

  function addSelectedNodes(nodeIds: string[]) {
    editorStore.selectedNodeIds.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: string[]) {
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
  function addSelectedEdges(edgeIds: string[]) {
    editorStore.selectedEdgeIds.push(...edgeIds);
  }

  function replaceSelectedEdges(edgeIds: string[]) {
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
  | ((EditorState & ReturnType<typeof createSelectionMethods>) & {
      editorStore: typeof editorInitialStore;
    })
  | null
>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const editorStore = proxy(editorInitialStore);

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
  }, [treeClient, editorStore]);

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
