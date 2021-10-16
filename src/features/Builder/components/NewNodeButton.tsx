import React from "react";
import { IconButton, StyleObject } from "@open-legal-tech/design-system";
import { useTreeService } from "../state/useTree";
import * as Node from "../types/Node";
import { Plus } from "react-feather";
import { useCenter } from "../utilities/useCenter";
import { nodeHeight, nodeWidth } from "../utilities/constants";

type Props = { css?: StyleObject };

export const NewNodeButton = ({ css }: Props) => {
  const service = useTreeService();
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("application/reactflow", "customNode");
    event.dataTransfer.effectAllowed = "move";
  };

  const center = useCenter({ x: nodeWidth / 2, y: nodeHeight / 2 });

  return (
    <IconButton
      variant="tertiary"
      size="large"
      round
      css={{ boxShadow: "$2", ...css }}
      label="Füge einen neuen Knoten hinzu"
      onDragStart={(event: any) => onDragStart(event)}
      onClick={() =>
        service.send({
          type: "addNode",
          value: Node.create({
            position: center,
            data: {
              label: "New Node",
            },
          }),
        })
      }
      draggable
      Icon={<Plus style={{ width: "30px", height: "30px" }} />}
    />
  );
};
