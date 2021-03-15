import React from "react";
import { useNodesStore } from "../../globalState";
import { RightSidebar } from "./RightSidebar";
import { CSS } from "utils/stitches.config";
import create from "zustand";

type SidebarState = {
  open: boolean;
  nodeId: string;
  nodeType: string;
  toggleSidebar: (boolean?: boolean) => void;
  openSidebar: (nodeId: string, nodeType: string) => void;
  closeSidebar: () => void;
};

export const useSidebarState = create<SidebarState>((set) => ({
  open: false,
  nodeId: "",
  nodeType: "",
  toggleSidebar: (boolean) =>
    set((state) => ({ open: boolean ? boolean : !state.open })),
  openSidebar: (nodeId, nodeType) => set({ open: true, nodeId, nodeType }),
  closeSidebar: () => set({ open: false, nodeId: "", nodeType: "" }),
}));

type NodeEditingSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  css?: CSS;
};

export const NodeEditingSidebar: React.FC<NodeEditingSidebarProps> = ({
  css,
}) => {
  const [
    nodeId,
    nodeType,
    isSidebarOpen,
    toggleSidebar,
  ] = useSidebarState((state) => [
    state.nodeId,
    state.nodeType,
    state.open,
    state.toggleSidebar,
  ]);

  const config = useNodesStore((state) => state.nodeTypes[nodeType]);
  const [node, setNode] = useNodesStore((state) => [
    state.nodes[nodeId],
    state.setNode,
  ]);

  return (
    <RightSidebar
      css={css}
      title="Knoten bearbeiten"
      width={700}
      open={isSidebarOpen}
      onOpenChange={toggleSidebar}
    >
      {nodeId ? (
        <>
          <header className="flex justify-between items-stretch space-x-4">
            <input
              className="text-xl font-semibold border-b-4 pb-1 bg-gray-100 flex-1"
              style={{ borderColor: config.color }}
              value={node.name}
              onChange={(event) =>
                setNode(nodeId, { name: event.target.value })
              }
              maxLength={30}
            />
          </header>
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Unused Inputs</h3>
            <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
              Filler
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Conditions</h3>
            <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
              Filler
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Question</h3>
            <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
              Filler
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">Answers</h3>
            <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
              Filler
            </div>
          </section>
        </>
      ) : (
        <p>Bitte wähle einen Knoten aus</p>
      )}
    </RightSidebar>
  );
};
