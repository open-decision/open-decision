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
  LoadingSpinner,
} from "@open-decision/design-system";
import { TreeCard } from "./components/TreeCard/TreeCard";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilter } from "./Filter";
import { Card } from "../../components/Card";
import { NewProjectDropdown } from "./NewProjectDropdown";
import { useTreeAPI } from "../Data/useTreeAPI";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("dashboard");

  const {
    data: trees,
    isLoading,
    isFetching,
  } = useTreeAPI().useTreesQuery({
    select: ({ data }) => data,
    staleTime: 500,
  });

  const hasTrees = trees && trees.length > 0;

  const { search, setSearch, SortButton, FilterButton, filteredData } =
    useFilter(trees ?? [], sorts, "updatedAt", filters, "active");

  const formState = Form.useFormState({
    defaultValues: { search },
    setValues: ({ search }) => setSearch(search),
  });

  // Hard loading state when fetching initial data
  if (isLoading)
    return (
      <LoadingSpinner size="50px" css={{ flex: 1, alignSelf: "center" }} />
    );

  return hasTrees ? (
    <>
      <Row css={{ justifyContent: "space-between", marginBlock: "$9 $7" }}>
        <Heading as="h1" size="large">
          {t("title")}
        </Heading>
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
          Label={t("treeList.search.label")}
          layout="no-label"
          css={{ flexBasis: "400px" }}
        >
          <Form.Input
            variant="lowered"
            name={formState.names.search}
            Icon={(props) => (
              <Icon {...props}>
                <MagnifyingGlassIcon />
              </Icon>
            )}
            placeholder={t("treeList.search.placeholder")}
          />
        </Form.Field>
        <Row css={{ gap: "$2", alignItems: "center" }}>
          <FilterButton />
          <SortButton />
          <LoadingSpinner isLoading={isFetching} />
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
            <NoProjects>{t("treeList.noResults")}</NoProjects>
          </Stack>
        )}
      </Stack>
    </>
  ) : (
    <EmptyState />
  );
};

const EmptyState = () => {
  const t = useTranslations("dashboard.treeList.empty");

  return (
    <Stack center css={{ flex: 1 }}>
      <Card css={{ alignItems: "center", padding: "$9", gap: "$2" }}>
        <Heading size="medium">{t("title")}</Heading>
        <Text size="large" css={{ marginBottom: "$6" }}>
          {t("callToAction")}{" "}
        </Text>
        <NewProjectDropdown size="large" />
      </Card>
    </Stack>
  );
};

export default TreeList;
