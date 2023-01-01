import React from "react";
import { motion } from "framer-motion";
import {
  Heading,
  Icon,
  Row,
  Stack,
  Text,
  Form,
  LoadingSpinner,
  headingClasses,
} from "@open-decision/design-system";
import { TreeCard } from "./components/TreeCard/TreeCard";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilter } from "./Filter";
import { cardClasses } from "../../components/Card";
import { NewProjectDropdown } from "./NewProjectDropdown";
import { useTreeAPI } from "@open-decision/api-react-binding";
import { useTranslations } from "next-intl";

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

  const { data: trees, isLoading } = useTreeAPI().useTreesQuery({
    select: ({ data }) => data,
  });

  const hasTrees = trees && trees.length > 0;

  const { search, setSearch, SortButton, FilterButton, filteredData } =
    useFilter(trees ?? [], sorts, "updatedAt", filters, "active");

  const methods = Form.useForm({
    defaultValues: { search },
  });

  // Hard loading state when fetching initial data
  if (isLoading) return <LoadingSpinner className="flex-1 items-center" />;

  return hasTrees ? (
    <>
      <Row className="justify-between mt-9 mb-7">
        <Heading as="h1" size="large">
          {t("title")}
        </Heading>
        <NewProjectDropdown />
      </Row>
      <Form.Root methods={methods} className="gap-2 justify-between flex-row">
        <Form.Field
          Label={t("treeList.search.label")}
          layout="no-label"
          className="basis-[400px]"
        >
          <Form.Input
            variant="lowered"
            {...methods.register("search", {
              onChange: (event) => setSearch(event.target.value),
            })}
            name="search"
            Icon={(props) => (
              <Icon {...props}>
                <MagnifyingGlassIcon />
              </Icon>
            )}
            placeholder={t("treeList.search.placeholder")}
          />
        </Form.Field>
        <Row className="gap-2 items-center">
          <FilterButton />
          <SortButton />
        </Row>
      </Form.Root>
      <Stack className="gap-2 mt-1 py-4 h-full w-[100% - var(--space-4)] px-2 overflow-y-auto w-[calc(100%+2*var(--space-2))] -ml-[var(--space-2)]">
        {filteredData.length > 0 ? (
          filteredData.map((tree) => (
            <motion.div key={tree.uuid} layout transition={{ duration: 0.5 }}>
              <TreeCard tree={tree} />
            </motion.div>
          ))
        ) : (
          <Stack className="h-full" center>
            <span className={headingClasses({})}>
              {t("treeList.noResults")}
            </span>
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
    <Stack center className="flex-1">
      <div className={cardClasses("items-center p-9 gap-2")}>
        <Heading size="medium">{t("title")}</Heading>
        <Text size="large" className="mb-6">
          {t("callToAction")}{" "}
        </Text>
        <NewProjectDropdown size="large" />
      </div>
    </Stack>
  );
};

export default TreeList;
