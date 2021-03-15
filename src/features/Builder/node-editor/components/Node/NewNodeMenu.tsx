import React from "react";
import { pick } from "remeda";
import { useEdgesStore, useNodesStore } from "../../globalState";
import { nanoid } from "nanoid/non-secure";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled } from "utils/stitches.config";
import { coordinates } from "../../types";

type NewNodeMenuProps = {
  nodeId: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const Content = styled(DropdownMenu.Content, {
  display: "grid",
  gap: "$2",
  minWidth: 130,
  backgroundColor: "white",
  borderRadius: "$sm",
  padding: "$2 $3",
  boxShadow: "$xl",
  marginTop: "$2",
});

const Item = styled(DropdownMenu.Item, {
  fontSize: "$md",
  padding: "$2 $4",
  cursor: "default",
  backgroundColor: "$gray100",
  fontWeight: "$semibold",

  "&:focus": {
    outline: "none",
    backgroundColor: "$gray300",
  },
});

const Label = styled(DropdownMenu.Label, {
  fontSize: "$sm",
  fontWeight: "$bold",
  color: "$gray700",
});

type useNewNode = (
  originCoordinates: coordinates,
  nodeId: string
) => (nodeType: string) => void;

const useNewNode: useNewNode = (originCoordinates, nodeId) => {
  const addNode = useNodesStore((state) => state.addNode);
  const addEdge = useEdgesStore((state) => state.addEdge);
  const nodeTypes = useNodesStore((state) => state.nodeTypes);

  const createNewNode = (nodeType: string) => {
    const nodeConfig = nodeTypes[nodeType];

    const newNodeCoordinates: coordinates = [
      originCoordinates[0] + nodeConfig.width + 150,
      originCoordinates[1],
    ];

    const newNodeId = nanoid(5);
    addNode(nodeType, newNodeCoordinates, newNodeId);
    addEdge(nodeId, newNodeId);
  };

  return createNewNode;
};

export const NewNodeMenu: React.FC<NewNodeMenuProps> = ({
  nodeId,
  open,
  onOpenChange,
  children,
}) => {
  const nodeTypes = useNodesStore((state) => state.nodeTypes);
  const options = Object.values(nodeTypes).map((nodeType) =>
    pick(nodeType, ["label", "color", "type", "width"])
  );

  const nodeCoordinates = useNodesStore(
    (state) => state.nodes[nodeId].coordinates
  );

  const createNewNode = useNewNode(nodeCoordinates, nodeId);

  return (
    <DropdownMenu.Root onOpenChange={onOpenChange} open={open}>
      {children}

      <Content>
        <Label css={{ marginBottom: "$2" }}>Neuen Knoten hinzufügen</Label>
        {options.map((option) => (
          <Item key={option.label} onSelect={() => createNewNode(option.type)}>
            {option.label}
          </Item>
        ))}
      </Content>
    </DropdownMenu.Root>
  );
};
