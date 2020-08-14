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

export const Builder = () => {
  const [nodes, setNodes] = React.useState({});
  // let { treeId } = useParams();
  // const [treeData, setTreeData] = React.useState();

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     setTreeData(await fetchDatabase(SINGLE_TREE, getSingleTreeData));
  //   };
  //   fetchData();
  // }, []);

  console.log(nodes);

  return (
    <Flex sx={{ alignItems: "start", flexWrap: "wrap" }}>
      <NodeEditor
        portTypes={config.portTypes}
        nodeTypes={config.nodeTypes}
        defaultNodes={[
          {
            type: "entrypoint",
            x: 190,
            y: -150,
          },
        ]}
        onChange={setNodes}
      />
    </Flex>
  );
};
