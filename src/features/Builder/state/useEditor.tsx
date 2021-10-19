import * as React from "react";
import { OnLoadParams, useZoomPanHelper } from "react-flow-renderer";
import { TNodeData } from "../types/Node";
import { useStoreActions } from "react-flow-renderer";
import { useTreeService, useTree } from "./useTree";
import { calculateCenterOfNode } from "../utilities/useCenter";
import { sidebarWidth, transitionDuration } from "../utilities/constants";
import { useUpdateEffect } from "react-use";
import { useSelector } from "@xstate/react";

type EditorState = {
  selectedNodeId: string;
  setSelectedNodeId: (newSelectedNodeId?: string) => void;
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance: (newInstance: OnLoadParams<any>) => void;
  isNodeEditingSidebarOpen: boolean;
  closeNodeEditingSidebar: () => void;
  isTransitioning: boolean;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const treeService = useTreeService();
  const selectedNodeId = useSelector(
    treeService,
    (state) => state.context.selectedNodeId
  );
  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<TNodeData> | undefined
  >();

  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const tree = useTree();

  const setSelectedElements = useStoreActions(
    (state) => state.setSelectedElements
  );

  const { setCenter } = useZoomPanHelper();
  useUpdateEffect(() => {
    if (selectedNodeId) {
      setIsTransitioning(true);
      const position = tree.nodes[selectedNodeId].position;
      const positionOfNodeFromCenter = calculateCenterOfNode(
        position,
        selectedNodeId ? { x: sidebarWidth / 2, y: 0 } : undefined
      );
      setCenter?.(positionOfNodeFromCenter.x, positionOfNodeFromCenter.y, 1);
    }

    // After the animation ends smoothPan is set back to inactive.
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);

    return () => clearTimeout(timer);
  }, [selectedNodeId]);

  const updateNodeId: EditorState["setSelectedNodeId"] = (selectedNodeId) => {
    setSelectedElements([{ id: selectedNodeId }]);
    treeService.send({
      type: "selectNode",
      nodeId: selectedNodeId ?? "",
    });
  };

  return (
    <EditorContext.Provider
      value={{
        selectedNodeId,
        setSelectedNodeId: updateNodeId,
        reactFlowInstance,
        setReactFlowInstance,
        isNodeEditingSidebarOpen: Boolean(selectedNodeId),
        closeNodeEditingSidebar: () =>
          treeService.send({ type: "selectNode", nodeId: "" }),
        isTransitioning,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = React.useContext(EditorContext);

  if (!editorContext) {
    throw new Error("useEditor can only be used inside of an EditorProvider");
  }

  return editorContext;
}
