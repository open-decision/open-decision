import React from "react";
import { motion } from "framer-motion";
import {
  Heading,
  Icon,
  Row,
  Stack,
  Text,
  Form,
  styled,
} from "@open-decision/design-system";
import { TreeCard } from "./components/TreeCard/TreeCard";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilter } from "./Filter";
import { Card } from "../../components/Card";
import { NewProjectDropdown } from "./NewProjectDropdown";
import { useTreesQuery } from "../Data/useTreesQuery";

const NoProjects = styled("span", Heading);

const sorts = {
  updatedAt: "Zuletzt bearbeitet",
  createdAt: "Erstellungsdatum",
};

const filters = {
  archived: "Archiviert",
  published: "Veröffentlicht",
};

export const TreeList = () => {
  const { data: trees } = useTreesQuery();

  const hasTrees = trees && trees.length > 0;

  const { search, setSearch, SortButton, FilterButton, filteredData } =
    useFilter(trees ?? [], sorts, "updatedAt", filters, "active");

  const formState = Form.useFormState({
    defaultValues: { search },
    setValues: ({ search }) => setSearch(search),
  });

  return hasTrees ? (
    <>
      <Row css={{ justifyContent: "space-between", marginBlock: "$9 $7" }}>
        <Heading size="large">Meine Projekte</Heading>
        <NewProjectDropdown />
      </Row>
      <Form.Root
        state={formState}
        css={{
          gap: "$2",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Form.Field
          Label="Suche"
          layout="no-label"
          css={{ flexBasis: "400px" }}
        >
          <Form.Input
            variant="lowered"
            name={formState.names.search}
            Icon={
              <Icon>
                <MagnifyingGlassIcon />
              </Icon>
            }
            placeholder="Suche"
          />
        </Form.Field>
        <Row css={{ gap: "$2" }}>
          <FilterButton />
          <SortButton />
        </Row>
      </Form.Root>
      <Stack
        css={{
          gap: "$2",
          marginTop: "$1",
          paddingBlock: "$4",
          height: "100%",
          width: "calc(100% + $space$4)",
          paddingInline: "$2",
          overflowY: "auto",
          alignSelf: "center",
        }}
      >
        {filteredData.length > 0 ? (
          filteredData.map((tree) => (
            <motion.div key={tree.uuid} layout transition={{ duration: 0.5 }}>
              <TreeCard tree={tree} />
            </motion.div>
          ))
        ) : (
          <Stack center css={{ height: "100%" }}>
            <NoProjects>Keine Projekte</NoProjects>
          </Stack>
        )}
      </Stack>
    </>
  ) : (
    <EmptyState />
  );
};

const EmptyState = () => (
  <Stack center css={{ flex: 1 }}>
    <Card css={{ alignItems: "center", padding: "$9", gap: "$2" }}>
      <Heading size="medium">
        Sie haben noch kein Open-Decision-Projekt.
      </Heading>
      <Text size="large" css={{ marginBottom: "$6" }}>
        Erstellen oder importieren Sie jetzt ihr erstes Projekt.
      </Text>
      <NewProjectDropdown size="large" />
    </Card>
  </Stack>
);

export default TreeList;
