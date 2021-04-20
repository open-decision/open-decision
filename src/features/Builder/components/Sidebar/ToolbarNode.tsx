import { ChatOutline } from "@graywolfai/react-heroicons";
import React from "react";

type ToolbarNode = React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    color?: string;
  }
>;

export const ToolbarNode: ToolbarNode = ({ label, color, ...props }) => {
  return (
    <div
      style={{ borderColor: color }}
      className="bg-gray-200 p-4 rounded shadow-md border-l-4 flex items-center font-semibold"
      {...props}
    >
      <ChatOutline
        style={{ width: "1.5em", color: color ?? "black" }}
        className="mr-2 rounded"
      />
      {label}
    </div>
  );
};
