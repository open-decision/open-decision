import { ElementData } from "features/Builder/NodeEditor";
import React from "react";
import { Node } from "react-flow-renderer";

type NodeEditingSidebarProps = {
  node: Node<ElementData> | undefined;
  setNode: (nodeId: string, newNode: Partial<Node<ElementData>>) => void;
};

export const NodeEditingSidebar = ({
  node,
  setNode,
}: NodeEditingSidebarProps): JSX.Element => {
  return node?.data ? (
    <>
      <header className="flex justify-between items-stretch space-x-4">
        <input
          className="text-xl font-semibold border-b-4 pb-1 bg-gray-100 flex-1"
          value={node.data.label}
          onChange={(event) =>
            setNode(node.id, { data: { label: event.target.value } })
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
