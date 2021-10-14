import * as React from "react";
import { OnLoadParams } from "react-flow-renderer";
import { TNodeData } from "../types/Node";
import { useStoreActions } from "react-flow-renderer";

type EditorState = {
  selectedNodeId: string | undefined;
  setSelectedNodeId: (newSelectedNodeId?: string) => void;
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance?: (newInstance: OnLoadParams<any>) => void;
  isNodeEditingSidebarOpen: boolean;
  closeNodeEditingSidebar: () => void;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const [selectedNodeId, setSelectedNodeId] =
    React.useState<EditorState["selectedNodeId"]>(undefined);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<TNodeData> | undefined
  >();

  const setSelectedElements = useStoreActions(
    (state) => state.setSelectedElements
  );
  const updateNodeId = (selectedNodeId: EditorState["selectedNodeId"]) => {
    setSelectedElements([{ id: selectedNodeId }]);
    setSelectedNodeId(selectedNodeId);
  };

  return (
    <EditorContext.Provider
      value={{
        selectedNodeId,
        setSelectedNodeId: updateNodeId,
        reactFlowInstance,
        setReactFlowInstance,
        isNodeEditingSidebarOpen: Boolean(selectedNodeId),
        closeNodeEditingSidebar: () => setSelectedNodeId(undefined),
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
