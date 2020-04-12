import { Table } from "./";
import { Button, Box, Container, Flex, Heading } from "theme-ui";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { useAuth } from "../../Features/Auth/useAuth";
import { fetchDatabase, getAllTreeData } from "../../backend-integration";
import { useQuery } from "react-query";
import { gql } from "graphql-request";

const ALL_TREES = gql`
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
export const Dashboard = ({ className = "" }) => {
  const auth = useAuth();

  const { data, status } = useQuery(
    ["allTrees", {}],
    fetchDatabase({
      query: ALL_TREES,
      dataAccessor: getAllTreeData,
      token: auth.user,
    })
  );

  console.log(data);

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
        {data && (
          <Container>
            <Table data={data} />
          </Container>
        )}
      </Box>
    </Flex>
  );
};
