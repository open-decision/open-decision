import clsx from "clsx";
import React from "react";
import * as Portal from "@radix-ui/react-portal";
import { pipe, prop } from "remeda";
import { coordinates } from "../../types";
import { calculateCurve } from "../../utilities";
import { Connection } from "../Connections/Connection";
import { useTreeStore } from "features/Builder/globalState";
import shallow from "zustand/shallow";

const portVariants = {
  connected: "h-4 w-4 bg-blue-500",
  unconnected: "h-7 w-7 bg-red-500 clickable",
  target: "h-4 w-4 bg-primary-500",
};

type Port = React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    variant: keyof typeof portVariants;
    type: "input" | "output";
  }
>;

export const Port: Port = ({
  children,
  className,
  nodeId,
  variant,
  type,
  ...props
}) => {
  const connectionRef = React.useRef<SVGPathElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const [addConnection, nodes] = useTreeStore(
    (state) => [state.addConnection, state.data.nodes],
    shallow
  );

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);

    document.addEventListener("pointerup", handleDragEnd);
    document.addEventListener(
      "pointermove",
      handleDrag([event.clientX, event.clientY])
    );
  };

  const handleDrag = (origin: coordinates) => (event: PointerEvent) => {
    const newCurve = calculateCurve([origin, [event.clientX, event.clientY]]);
    newCurve && connectionRef.current?.setAttribute("d", newCurve);
  };

  const handleDragEnd = (event: PointerEvent) => {
    setDragging(false);
    document.removeEventListener("pointerup", handleDragEnd);
    document.removeEventListener("pointermove", handleDrag([0, 0]));

    if (!(event.target instanceof HTMLElement)) return;
    if (
      event.target.dataset.id &&
      Object.keys(nodes).includes(event.target.dataset.id)
    )
      addConnection(nodeId, event.target.dataset.id);
  };

  return (
    <div
      onPointerDown={handleDragStart}
      className={clsx(
        className,
        "rounded-full border-2 border-gray-200 shadow-md relative",
        pipe(portVariants, prop(variant))
      )}
      {...props}
    >
      {children}
      {type === "output" && dragging && (
        <Portal.Root>
          <Connection ref={connectionRef} />
        </Portal.Root>
      )}
    </div>
  );
};
