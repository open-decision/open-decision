import { Table } from "./";
import { Button, Box, Container, Flex, Heading } from "theme-ui";
import React from "react";
import AddIcon from "@material-ui/icons/Add";

import { fetchDatabase } from "../../backend-integration/fetchDatabase";
import { ALL_TREES } from "../../backend-integration/queries/allTrees";
import { getTreeData } from "../../backend-integration/dataAccessors/getTreeData";

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
    <Flex
      className={className}
      sx={{
        bg: "grays.2",
        flexDirection: "column",
      }}
    >
      <Container
        sx={{
          flex: "1 1 40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "start",
          my: 4,
        }}
      >
        <Heading as="h2" sx={{ fontSize: 6, color: "grays.3" }}>
          Hallo Dirk_laywer23
        </Heading>
        <Button
          sx={{
            fontSize: 3,
            marginTop: 4,
          }}
          variant="large"
        >
          <AddIcon />
          Neuen Baum hinzufügen
        </Button>
      </Container>
      <Box
        sx={{
          bg: "grays.1",
          flex: "1 1 60%",
        }}
      >
        {treeData && (
          <Container>
            <Table data={treeData} />
          </Container>
        )}
      </Box>
    </Flex>
  );
};
