/**@jsx jsx */
import { Table } from "./Table/Table";
import { jsx, Button, Box, Container, Flex, Heading, Spinner } from "theme-ui";
import AddIcon from "@material-ui/icons/Add";
import { columns, defaultColumn } from "./Table/TableData";
import { GlobalProps } from "types/global";
import { map, pipe, pathOr, prop, pick } from "remeda";
import { FunctionComponent } from "react";
import {
  useAll_TreesQuery,
  useCreate_TreeMutation,
} from "../../generated/graphql";
import {} from "fp-ts";

//FIXME username is hardcoded
export const Dashboard: FunctionComponent<GlobalProps> = ({
  className = "",
}) => {
  const [{ data, fetching, error }] = useAll_TreesQuery();
  const [, createTree] = useCreate_TreeMutation();

  const treeData = pipe(data, pathOr(["allDecisionTrees", "edges"], []));

  map(treeData, (x) => x.node);

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
          onClick={() =>
            createTree({
              input: {
                name: "Tes",
              },
            }).then((result) => console.log(result))
          }
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
            <Spinner />
          ) : (
            <Table columns={columns} data={[]} defaultColumn={defaultColumn} />
          )}
        </Container>
        )
      </Box>
    </Flex>
  );
};
