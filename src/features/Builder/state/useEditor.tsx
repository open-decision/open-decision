import * as React from "react";
import { OnLoadParams } from "react-flow-renderer";
import { TElementData } from "../types";

type EditorState = {
  selectedNodeId: string;
  setSelectedNodeId: (newSelectedNodeId: string) => void;
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance?: (newInstance: OnLoadParams<any>) => void;
  isNodeEditingSidebarOpen: boolean;
  setNodeEditingSidebarOpen: (newState: boolean) => void;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const [selectedNodeId, setSelectedNodeId] = React.useState("");
  const [isNodeEditingSidebarOpen, setNodeEditingSidebarOpen] =
    React.useState(false);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<TElementData> | undefined
  >();

  return (
    <EditorContext.Provider
      value={{
        selectedNodeId,
        setSelectedNodeId,
        reactFlowInstance,
        setReactFlowInstance,
        isNodeEditingSidebarOpen,
        setNodeEditingSidebarOpen,
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
