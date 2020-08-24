import React from "react";
// import {
//   fetchDatabase,
//   SINGLE_TREE,
//   getSingleTreeData,
// } from "./backend-integration";
import { Flex } from "theme-ui";
import { NodeEditor } from "flume";
import config from "./config";
import testTree from "./testTree";

export const Builder = () => {
  const [state, setState] = React.useState(testTree);

  // const [treeData, setTreeData] = React.useState();

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     setTreeData(await fetchDatabase(SINGLE_TREE, getSingleTreeData));
  //   };
  //   fetchData();
  // }, []);

  return (
    <Flex sx={{ alignItems: "start", flexWrap: "wrap" }}>
      <NodeEditor
        portTypes={config.portTypes}
        nodeTypes={config.nodeTypes}
        nodes={state}
        onChange={setState}
        // debug="true"
      />
    </Flex>
  );
};
