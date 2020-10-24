import React, { FunctionComponent } from "react";
import { Flex } from "theme-ui";
import { NodeEditor } from "flume-test";
import config from "./config";

export const Builder: FunctionComponent<Record<string, unknown>> = () => {
  const [nodes, setNodes] = React.useState();

  //TODO when Tree Data is accessible in the graphql API this function needs to be rewriten with the useQuery Hook from apollo

  return (
    <Flex sx={{ alignItems: "start", flexWrap: "wrap" }}>
      <NodeEditor
        portTypes={config.portTypes}
        nodeTypes={config.nodeTypes}
        nodes={nodes}
        onChange={setNodes}
        defaultNodes={[
          {
            type: "homepage",
            x: 190,
            y: -150,
          },
        ]}
        debug={true}
      />
    </Flex>
  );
};
