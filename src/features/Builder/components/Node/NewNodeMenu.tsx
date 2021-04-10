import React from "react";
import { pick } from "remeda";
import { useTreeStore } from "../../globalState";
import { nanoid } from "nanoid/non-secure";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled } from "utils/stitches.config";
import { coordinates, node } from "../../types";
import shallow from "zustand/shallow";

type NewNodeMenuProps = {
  node: node;
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

type useNewNode = (originNode: node) => (nodeType: string) => void;

const useNewNode: useNewNode = (originNode) => {
  const [addNode, nodeTypes, addConnection] = useTreeStore(
    (state) => [state.addNode, state.data.nodeTypes, state.addConnection],
    shallow
  );

  const createNewNode = (nodeType: string) => {
    const config = nodeTypes[nodeType];

    const newNodeCoordinates: coordinates = [
      originNode.coordinates[0] + config.width + 150,
      originNode.coordinates[1],
    ];

    const newNodeId = nanoid(5);
    addNode({
      id: newNodeId,
      coordinates: newNodeCoordinates,
      type: nodeType,
      name: config.label,
    });
    addConnection(originNode.id, newNodeId);
  };

  return createNewNode;
};

export const NewNodeMenu: React.FC<NewNodeMenuProps> = ({
  node,
  open,
  onOpenChange,
  children,
}) => {
  const nodeTypes = useTreeStore((state) => state.data.nodeTypes, shallow);
  const options = Object.values(nodeTypes).map((nodeType) =>
    pick(nodeType, ["label", "color", "type", "width"])
  );

  const createNewNode = useNewNode(node);

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
