import * as React from "react";
import { OnLoadParams, useZoomPanHelper } from "react-flow-renderer";
import { calculateCenterOfNode } from "../utilities/useCenter";
import { sidebarWidth, transitionDuration } from "../utilities/constants";
import { useTree } from "./useTree";
import { Context, SendFn } from "./treeMachine";
import { BuilderNode } from "@open-decision/type-classes";

type EditorState = {
  send: SendFn;
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance: (newInstance: OnLoadParams<any>) => void;
  isNodeEditingSidebarOpen: boolean;
  closeNodeEditingSidebar: () => void;
  isTransitioning: boolean;
} & Context;

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const [state, send] = useTree();
  const selectedNodeId = state?.context?.selectedNodeId;

  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<BuilderNode.TNode> | undefined
  >();

  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { setCenter } = useZoomPanHelper();
  React.useEffect(() => {
    if (selectedNodeId) {
      setIsTransitioning(true);
      const position = state.context.nodes[selectedNodeId].position;
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
  }, [selectedNodeId, setCenter, state.context.nodes]);

  return (
    <EditorContext.Provider
      value={{
        send,
        reactFlowInstance,
        setReactFlowInstance,
        isNodeEditingSidebarOpen: Boolean(selectedNodeId),
        closeNodeEditingSidebar: () => send({ type: "selectNode", nodeId: "" }),
        isTransitioning,
        ...state.context,
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
