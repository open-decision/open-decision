import React from "react";
import { useParams } from "react-router-dom";
import {
  fetchDatabase,
  SINGLE_TREE,
  getSingleTreeData,
} from "backendIntegration/index";
import { Card, Flex } from "theme-ui";

export const Builder = () => {
  let { treeId } = useParams();
  const [treeData, setTreeData] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      setTreeData(await fetchDatabase(SINGLE_TREE, getSingleTreeData));
    };
    fetchData();
  }, []);

  console.log(treeData);

  return (
    <Flex sx={{ alignItems: "start", flexWrap: "wrap" }}>
      {treeData &&
        treeData.map((node) => (
          <Card key={node.name} sx={{ m: 4 }}>
            {node.name}
          </Card>
        ))}
    </Flex>
  );
};
