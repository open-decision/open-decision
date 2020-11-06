import React from "react";
import { NodeEditor } from "flume-test";
import config from "./config";

export const Builder: React.FC = () => {
  const [nodes, setNodes] = React.useState();

  return (
    <NodeEditor
      portTypes={config.portTypes}
      nodeTypes={config.nodeTypes}
      nodes={nodes}
      onChange={setNodes}
      defaultNodes={[{ type: "homepage", x: 190, y: -150 }]}
    />
  );
};
