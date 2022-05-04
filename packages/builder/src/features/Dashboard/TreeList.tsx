import React from "react";
import { motion } from "framer-motion";
import {
  Field,
  Heading,
  Icon,
  Input,
  Row,
  Stack,
  Text,
  useForm,
} from "@open-decision/design-system";
import { useTreesQuery } from "features/Data/generated/graphql";
import { TreeCard } from "./TreeCard";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilter } from "./Filter";
import { Card } from "components/Card";
import { NewProjectDropdown } from "./NewProjectDropdown";

const sorts = {
  updatedAt: "Zuletzt bearbeitet",
  createdAt: "Erstellungsdatum",
};

const filters = {
  archived: "Archiviert",
};

export const TreeList = () => {
  const { data: trees } = useTreesQuery();
  const hasTrees = trees && trees?.decisionTrees.length > 0;

  const [Form] = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { search, setSearch, SortButton, FilterButton, filteredData } =
    useFilter(trees?.decisionTrees ?? [], sorts, "updatedAt", filters);

  return hasTrees ? (
    <>
      <Row css={{ justifyContent: "space-between", marginBlock: "$9 $7" }}>
        <Heading size="large">Meine Projekte</Heading>
        <NewProjectDropdown />
      </Row>
      <Form
        css={{
          display: "flex",
          gap: "$2",
          justifyContent: "space-between",
        }}
      >
        <Field
          label="Suche"
          isLabelVisible={false}
          css={{ flexBasis: "400px" }}
        >
          <Input
            variant="lowered"
            name="search"
            value={search || ""}
            onChange={(event) => setSearch(event.target.value)}
            Icon={
              <Icon>
                <MagnifyingGlassIcon />
              </Icon>
            }
            placeholder="Suche"
          />
        </Field>
        <Row css={{ gap: "$2" }}>
          <FilterButton />
          <SortButton />
        </Row>
      </Form>
      <Stack
        css={{
          gap: "$2",
          marginTop: "$1",
          paddingBlock: "$4",
          overflow: "auto",
          height: "100%",
        }}
      >
        {filteredData.map((tree) => (
          <motion.div key={tree.uuid} layout transition={{ duration: 0.5 }}>
            <TreeCard tree={tree} />
          </motion.div>
        ))}
      </Stack>
    </>
  ) : (
    <EmptyState />
  );
};

const EmptyState = () => (
  <Stack center css={{ flex: 1 }}>
    <Card css={{ alignItems: "center", padding: "$9", gap: "$2" }}>
      <Heading>Sie haben noch kein Open-Decision-Projekt.</Heading>
      <Text size="large" css={{ marginBottom: "$6" }}>
        Erstellen oder importieren Sie jetzt ihr erstes Projekt.
      </Text>
      <NewProjectDropdown size="large" />
    </Card>
  </Stack>
);
