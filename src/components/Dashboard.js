import { TreeTable } from "components";
import { Greeting } from "components";
import { Button, Box } from "theme-ui";
import React from "react";
import { fetchDatabase } from "../backend-integration/fetchDatabase";
import AddIcon from "@material-ui/icons/Add";
import { ALL_TREES } from "../backend-integration/queries/allTrees";
import { getTreeData } from "../backend-integration/dataAccessors/getTreeData";

//DEP username is hardcoded
export const Dashboard = ({ className }) => {
  const [treeData, setTreeData] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      setTreeData(await fetchDatabase(ALL_TREES, getTreeData));
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
        gridTemplateRows: "3fr 4fr",
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
          <AddIcon />
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
