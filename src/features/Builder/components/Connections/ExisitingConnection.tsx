import React from "react";
import { calculateCurve, getConnectionCoordinates } from "../../utilities";
import { useTreeStore } from "../../globalState";
import { node } from "../../types";
import { Connection } from "./Connection";
import { useGesture } from "react-use-gesture";

type ConnectionProps = {
  output: node;
  input: node;
};
export const ExistingConnection: React.FC<ConnectionProps> = ({
  output,
  input,
}) => {
  const [nodeTypes, removeConnection] = useTreeStore((state) => [
    state.data.nodeTypes,
    state.removeConnection,
  ]);
  const [hovered, setHovered] = React.useState(false);

  const curve = calculateCurve(
    getConnectionCoordinates(
      {
        coordinates: output.coordinates,
        height: nodeTypes[output.type].height,
        width: nodeTypes[output.type].width,
      },
      {
        coordinates: input.coordinates,
        height: nodeTypes[input.type].height,
        width: nodeTypes[input.type].width,
      }
    )
  );

  const gestures = useGesture({
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onPointerDown: ({ event }) => event.stopPropagation(),
    onClick: () => removeConnection(output.id, input.id),
  });

  return (
    <Connection
      {...gestures()}
      enableEvents={true}
      curve={curve ?? ""}
      hovered={hovered}
    />
  );
};
