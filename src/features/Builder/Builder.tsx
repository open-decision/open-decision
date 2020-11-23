import React from "react";
import { NodeEditor, Nodes } from "flume";
import config from "./config";
import { Button } from "@components/index";

const Editor: React.FC<{ initialNodes?: any; setNodes?: any }> = ({
  initialNodes,
  setNodes,
}) => {
  return (
    <NodeEditor
      portTypes={config.portTypes}
      nodeTypes={config.nodeTypes}
      nodes={initialNodes}
      onChange={setNodes}
    />
  );
};

export const Builder = () => {
  const [nodes, setNodes] = React.useState();
  console.log(nodes);

  return (
    <div className="relative" style={{ backgroundColor: "#1a1c1d" }}>
      <div className="absolute p-5 z-20 space-x-6">
        <Button onClick={() => alert(JSON.stringify(nodes))}>Export</Button>
        <Button
          onClick={() => {
            const data = prompt("Bitte Baumdaten eingeben.") || "{}";
            const parsedData = JSON.parse(data);
            setNodes(parsedData);
          }}
        >
          Import
        </Button>
        <Button
          onClick={() => {
            setNodes(undefined);
          }}
        >
          Reset
        </Button>
      </div>
      {nodes ? <Editor initialNodes={nodes} setNodes={setNodes} /> : null}
    </div>
  );
};
