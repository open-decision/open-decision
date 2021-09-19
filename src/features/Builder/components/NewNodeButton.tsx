import React from "react";
import { IconButton, StyleObject } from "@open-legal-tech/design-system";
import { useTree } from "../state/useTree";
import * as Node from "../types/Node";
import { useStoreState } from "react-flow-renderer";
import { Plus } from "react-feather";

type Props = { css?: StyleObject };

export const NewNodeButton = ({ css }: Props) => {
  const service = useTree();
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("application/reactflow", "default");
    event.dataTransfer.effectAllowed = "move";
  };

  const [[xTransform, yTransform, zoom], width, height] = useStoreState(
    (state) => [state.transform, state.width, state.height]
  );
  const center = {
    x: (width / 2 - xTransform) / zoom,
    y: (height / 2 - yTransform) / zoom,
  };

  return (
    <IconButton
      variant="secondary"
      css={css}
      label="Füge einen neuen Knoten hinzu"
      onDragStart={(event) => onDragStart(event)}
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
