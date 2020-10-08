import React, { FunctionComponent } from "react";
// import {
//   fetchDatabase,
//   SINGLE_TREE,
//   getSingleTreeData,
// } from "../../backend-integration";
import { Flex } from "theme-ui";
import { NodeEditor } from "flume";
import config from "./config";

export const Builder: FunctionComponent<Record<string, unknown>> = () => {
  const [nodes, setNodes] = React.useState();

  //TODO when Tree Data is accessible in the graphql API this function needs to be rewriten with the useQuery Hook from apollo
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const { data, success, errors } = await fetchDatabase({
  //       query: SINGLE_TREE,
  //       dataAccessor: getSingleTreeData,
  //     });

  //     if (success) {
  //       setNodes(data);
  //     }
  //   };
  //   fetchData();
  // }, []);

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
      />
    </Flex>
  );
};
