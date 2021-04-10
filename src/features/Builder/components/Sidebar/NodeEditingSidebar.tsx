import React from "react";
import { useTreeStore } from "../../globalState";
import create from "zustand";
import shallow from "zustand/shallow";

type SidebarState = {
  open: boolean;
  nodeId: string;
  nodeType: string;
  toggleSidebar: (boolean?: boolean) => void;
  openSidebar: (nodeId: string, nodeType: string) => void;
  closeSidebar: () => void;
};

export const useNodeEditingSidebarState = create<SidebarState>((set) => ({
  open: false,
  nodeId: "",
  nodeType: "",
  toggleSidebar: (boolean) => {
    console.log(boolean);
    set((state) => ({ open: boolean !== undefined ? boolean : !state.open }));
  },
  openSidebar: (nodeId, nodeType) => set({ open: true, nodeId, nodeType }),
  closeSidebar: () => set({ open: false, nodeId: "", nodeType: "" }),
}));

export const NodeEditingSidebar = (): JSX.Element => {
  const [nodeId, nodeType] = useNodeEditingSidebarState((state) => [
    state.nodeId,
    state.nodeType,
  ]);

  const [config, node, setNode] = useTreeStore(
    (state) => [
      state.data.nodeTypes[nodeType],
      state.data.nodes[nodeId],
      state.setNode,
    ],
    shallow
  );

  return nodeId ? (
    <>
      <header className="flex justify-between items-stretch space-x-4">
        <input
          className="text-xl font-semibold border-b-4 pb-1 bg-gray-100 flex-1"
          style={{ borderColor: config.color }}
          value={node.name}
          onChange={(event) =>
            setNode({ id: nodeId, name: event.target.value })
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
  );
};
