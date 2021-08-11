import { Heading, styled } from "@open-legal-tech/design-system";
import { RichTextEditor } from "components";
import { ElementData } from "features/Builder/NodeEditor";
import React from "react";
import { Node } from "react-flow-renderer";

const SidebarHeading = styled("h3", Heading, {})

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
          className="text-xl font-semibold border-b-4 pb-1 bg-gray2 flex-1"
          value={node.data.label}
          onChange={(event) =>
            setNode(node.id, { data: { label: event.target.value } })
          }
          maxLength={30}
        />
      </header>
      <section className="space-y-2">
        <SidebarHeading className="text-lg font-semibold">
          Unused Inputs
        </SidebarHeading>
        <div className="w-full h-52 bg-gray4 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <SidebarHeading className="text-lg font-semibold">
          Conditions
        </SidebarHeading>
        <div className="w-full h-52 bg-gray4 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <SidebarHeading className="text-lg font-semibold">
          Question
        </SidebarHeading>
        <RichTextEditor />
      </section>
      <section className="space-y-2">
        <SidebarHeading className="text-lg font-semibold">
          Answers
        </SidebarHeading>
        <div className="w-full h-52 bg-gray4 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
};
