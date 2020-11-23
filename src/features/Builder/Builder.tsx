import React from "react";
import { NodeEditor, Nodes } from "flume";
import config from "./config";

export const Builder: React.FC = () => {
  const [nodes, setNodes] = React.useState<Nodes>({});

  return (
    <NodeEditor
      portTypes={config.portTypes}
      nodeTypes={config.nodeTypes}
      nodes={nodes}
      onChange={setNodes}
    />
  );
};
