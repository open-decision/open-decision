import * as React from "react";
import {
  OnLoadParams,
  useStoreState,
  useZoomPanHelper,
} from "react-flow-renderer";
import { calculateCenterOfNode } from "../utilities/calculateCenterOfNode";
import { sidebarWidth, transitionDuration } from "../utilities/constants";
import { useTree } from "./useTree";
import { BuilderNode } from "@open-decision/type-classes";
import { TCoordinates } from "@open-decision/type-classes/src/Node/BuilderNode";

type projectCoordinatesFn = (
  coordinates: TCoordinates
) => TCoordinates | undefined;

type EditorState = {
  getCenter: () => TCoordinates | undefined;
  projectCoordinates: projectCoordinatesFn;
  reactFlowWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance: (newInstance: OnLoadParams<any>) => void;
  closeNodeEditingSidebar: () => void;
  isTransitioning: boolean;
  isConnecting: boolean;
  connectingNodeId?: string;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const [selectedNodeId, send] = useTree((state) => state.selectedNodeId);
  const [nodes] = useTree((state) => state.nodes);
  const reactFlowWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();

  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<BuilderNode.TNode> | undefined
  >();

  const getCenter = () => {
    if (!reactFlowBounds) return undefined;

    return reactFlowInstance?.project({
      x: reactFlowBounds.width / 2,
      y: reactFlowBounds.height / 2,
    });
  };

  const projectCoordinates: projectCoordinatesFn = (coordinates) => {
    if (!reactFlowBounds) return undefined;

    return reactFlowInstance?.project({
      x: coordinates.x - reactFlowBounds.left,
      y: coordinates.y - reactFlowBounds.top,
    });
  };

  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const position = selectedNodeId
    ? nodes?.[selectedNodeId]?.position
    : undefined;

  const { setCenter } = useZoomPanHelper();
  React.useEffect(() => {
    if (selectedNodeId && position) {
      setIsTransitioning(true);
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
  }, [position, selectedNodeId, setCenter]);

  const connectingNodeId = useStoreState((state) => state.connectionNodeId);
  const isConnecting = useStoreState((state) => state.connectionNodeId != null);

  return (
    <EditorContext.Provider
      value={{
        projectCoordinates,
        getCenter,
        reactFlowWrapperRef,
        reactFlowInstance,
        setReactFlowInstance,
        closeNodeEditingSidebar: () => send({ type: "selectNode", nodeId: "" }),
        isTransitioning,
        isConnecting,
        connectingNodeId: connectingNodeId ? connectingNodeId : undefined,
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
