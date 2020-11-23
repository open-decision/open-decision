import React from "react";
import { NodeEditor, Nodes } from "flume";
import config from "./config";
import { Button } from "@components/index";

const Editor: React.FC = ({ initialNodes }) => {
  const [nodes, setNodes] = React.useState<Nodes>(initialNodes);

  return (
    <NodeEditor
      portTypes={config.portTypes}
      nodeTypes={config.nodeTypes}
      nodes={nodes}
      onChange={setNodes}
    />
  );
};

export const Builder = () => {
  const [nodes, setNodes] = React.useState();

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
            setNodes();
          }}
        >
          Reset
        </Button>
      </div>
      {nodes ? <Editor initialNodes={nodes} /> : null}
    </div>
  );
};
