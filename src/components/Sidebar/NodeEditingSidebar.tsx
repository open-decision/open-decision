import { styled, Box, Input, Heading } from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { TElementData } from "features/Builder/types";

import React from "react";
import { Node } from "react-flow-renderer";

const SidebarHeading = styled(Heading, {});

type NodeEditingSidebarProps = {
  node: Node<TElementData> | undefined;
  setNode: (nodeId: string, newNode: Partial<Node<TElementData>>) => void;
};

export const NodeEditingSidebar = ({
  node,
  setNode,
}: NodeEditingSidebarProps): JSX.Element => {
  return node?.data ? (
    <>
      <Box as="header">
        <Input
          css={{ width: "100%" }}
          value={node.data.label}
          onChange={(event) =>
            setNode(node.id, { data: { label: event.target.value } })
          }
          maxLength={30}
        />
      </Box>
      <Box as="section">
        <SidebarHeading className="text-lg font-semibold">
          Inhalt
        </SidebarHeading>
        <RichTextEditor />
      </Box>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
};
