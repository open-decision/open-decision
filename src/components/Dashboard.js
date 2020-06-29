import { TreeTable } from "components";
import { Greeting } from "components";
import { Button, Box } from "theme-ui";
import React from "react";
import { readTrees } from "../backend-integration/readTrees";
import { lensPath, view } from "ramda";

const treeDataLens = lensPath(["data", "allDecisionTrees", "edges"]);
//DEP username is hardcoded
export const Dashboard = ({ className }) => {
  const [treeData, setTreeData] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      setTreeData(await view(treeDataLens)(await readTrees()));
    };
    fetchData();
  }, []);

  return (
    <div
      className={className}
      sx={{
        backgroundColor: "#E5E5E5",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr",
        gridTemplateRows: "4fr 4fr",
      }}
    >
      <Box sx={{ gridColumn: "2 / 3", alignSelf: "flex-end", mb: 4 }}>
        <Greeting>Dirk_laywer23</Greeting>
        <Button
          sx={{
            borderRadius: 3,
            padding: 4,
            fontSize: 3,
            marginTop: 4,
            backgroundColor: "tertiary.primary",
            color: "tertiary.contrast",
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Neuen Baum hinzufügen
        </Button>
      </Box>
      <div
        sx={{
          backgroundColor: "grays.1",
          gridColumn: "1 / -1",
          display: "grid",
          gridTemplateColumns: "inherit",
        }}
      >
        {treeData && (
          <TreeTable sx={{ gridColumn: "2 / 3" }} treeData={treeData} />
        )}
      </div>
    </div>
  );
};
