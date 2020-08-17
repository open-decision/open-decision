import React from "react";
import { useParams } from "react-router-dom";
import {
  fetchDatabase,
  SINGLE_TREE,
  getSingleTreeData,
} from "backendIntegration/index";
import { Flex } from "theme-ui";
import { NodeEditor } from "flume";
import config from "./config";
import testTree from "./testTree";

export const Builder = () => {
  const [nodes, setNodes] = React.useState(testTree);
  // let { treeId } = useParams();
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
        nodes={nodes}
        onChange={setNodes}
      />
    </Flex>
  );
};
