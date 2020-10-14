/**@jsx jsx */
import { jsx } from "theme-ui";
import { Table } from "./Table/Table";
import { Button, Box, Container, Flex, Heading } from "theme-ui";
import AddIcon from "@material-ui/icons/Add";
import { columns, defaultColumn } from "./Table/TableData";
// import { useQuery, gql } from "@apollo/client";
import { allTreeData, GlobalProps } from "types/global";
import { map, pipe, pathOr } from "remeda";
import { FunctionComponent } from "react";

import { useQuery } from "urql";

const ALL_TREES = `
  {
    allDecisionTrees {
      edges {
        node {
          id
          name
          slug
          tags
          createdAt
        }
      }
    }
  }
`;

//FIXME username is hardcoded
export const Dashboard: FunctionComponent<GlobalProps> = ({
  className = "",
}) => {
  const [{ data, fetching, error }] = useQuery<allTreeData>({
    query: ALL_TREES,
  });

  const treeData = pipe(
    data,
    pathOr(["allDecisionTrees", "edges"], []),
    map((x) => x.node)
  );

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
            boxShadow: 0,
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
        <Container>
          {error ? (
            <p>Error :(</p>
          ) : fetching ? (
            <h1>Loading ...</h1>
          ) : (
            <Table
              columns={columns}
              data={treeData}
              defaultColumn={defaultColumn}
            />
          )}
        </Container>
        )
      </Box>
    </Flex>
  );
};
