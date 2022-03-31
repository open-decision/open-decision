import React from "react";
import { fuzzySearch, sortByKey } from "./filter";
import { motion } from "framer-motion";
import { identity, pipe } from "remeda";
import {
  Box,
  Button,
  DropdownMenu,
  Field,
  Heading,
  Icon,
  Input,
  Link,
  LoadingSpinner,
  Stack,
  Text,
  useForm,
} from "@open-decision/design-system";
import { ChevronUp, Search } from "react-feather";
import { TreesQuery, useTreesQuery } from "features/Data/generated/graphql";
import { TreeCard } from "./TreeCard";
import Image from "next/image";
import { ErrorBoundary } from "@sentry/nextjs";

const sortReadableNames = {
  updatedAt: "Zuletzt bearbeitet",
  createdAt: "Erstellungsdatum",
};

const sortDirectionReadableNames = {
  descending: "Absteigend",
  ascending: "Aufsteigend",
};

type sortState = { key: string; direction: "ascending" | "descending" };

const sortData = (sort: sortState) => (data: any[]) =>
  sort.direction === "descending"
    ? sortByKey(data, sort.key)
    : sortByKey(data, sort.key).reverse();

const filterData = (filter: string) => (data: any[]) =>
  fuzzySearch(data, filter);

export const TreeListBody = () => {
  const { data: trees } = useTreesQuery();
  const hasTrees = trees && trees?.decisionTrees.length > 0;

  const [filter, setFilter] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<
    TreesQuery["decisionTrees"]
  >([]);
  const [sort, setSort] = React.useState<sortState>({
    key: "updatedAt",
    direction: "ascending",
  });

  const [Form] = useForm({
    defaultValues: {
      search: "",
    },
  });

  const handleFilterChange = React.useCallback(
    function handleFilterChange() {
      if (!trees?.decisionTrees) return;

      const modifiedData = pipe(
        trees?.decisionTrees,
        filter ? filterData(filter) : identity,
        sort.key ? sortData(sort) : identity
      );

      setFilteredData(modifiedData);
    },
    [trees?.decisionTrees, filter, sort]
  );

  React.useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return hasTrees ? (
    <>
      <Form
        onSubmit={handleFilterChange}
        css={{
          display: "flex",
          gap: "$2",
          justifyContent: "space-between",
          paddingInline: "$4",
        }}
      >
        <Field
          label="Suche"
          isLabelVisible={false}
          css={{ flexBasis: "400px", layer: "1" }}
        >
          <Input
            name="search"
            value={filter || ""}
            onChange={(event) => setFilter(event.target.value)}
            Icon={
              <Icon>
                <Search />
              </Icon>
            }
            placeholder="Suche"
          />
        </Field>
        <DropdownMenu.Root>
          <Stack
            css={{ flexDirection: "row", alignItems: "center", gap: "$2" }}
          >
            <DropdownMenu.Trigger asChild>
              <Button
                variant="neutral"
                css={{
                  gap: "$3",
                }}
              >
                <span>{sortReadableNames[sort.key]}</span>
              </Button>
            </DropdownMenu.Trigger>
            <Button
              onClick={() =>
                setSort({
                  ...sort,
                  direction:
                    sort.direction === "descending"
                      ? "ascending"
                      : "descending",
                })
              }
              data-direction={sort.direction}
              variant="tertiary"
              size="small"
              css={{
                svg: {
                  transition: "transform 0.2s ease-in",
                  transform: "rotate(0deg)",
                },

                "&[data-direction='descending']": {
                  svg: {
                    transform: "rotate(180deg)",
                  },
                },
              }}
            >
              {sortDirectionReadableNames[sort.direction]}
              <Icon>
                <ChevronUp />
              </Icon>
            </Button>
          </Stack>
          <DropdownMenu.Content align="start">
            <DropdownMenu.CheckboxItem
              checked={sort.key === "updatedAt"}
              onSelect={() => setSort({ ...sort, key: "updatedAt" })}
            >
              {sortReadableNames.updatedAt}
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={sort.key === "createdAt"}
              onSelect={() => setSort({ ...sort, key: "createdAt" })}
            >
              {sortReadableNames.createdAt}
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Form>
      <Stack
        css={{
          gap: "$3",
          marginTop: "$1",
          paddingBlock: "$4",
          paddingInline: "$4",
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
  <Box
    css={{
      transform: "scaleX(-1)",
      height: "70%",
      width: "100%",
      position: "relative",
    }}
  >
    <Image
      src="/EmptyIllustration.png"
      layout="fill"
      objectFit="contain"
      priority
    />
  </Box>
);

export function TreeList() {
  return (
    <Stack
      css={{
        justifyContent: "center",
        overflow: "auto",
        marginInline: "-$4",
        gridColumn: 2,
        height: "100%",
      }}
    >
      <ErrorBoundary
        fallback={
          <Box
            css={{
              gridColumn: "1 / -1",
              gridRow: "2",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Heading>
              Beim laden ihrer Bäume ist ein Fehler aufgetreten.
            </Heading>
            <Text size="large" css={{ marginTop: "$3" }}>
              Bitte laden sie die Seite neu oder schreiben sie uns wenn der
              Fehler weiterhin auftreten sollte.
              <Link href="https://www.notion.so/openlegaltech/a8a6b8db7e2b485294b6e31c1b3ae9da?v=ae3429d3f8d04d3395126baaa8147fe5">
                Feedback Formular
              </Link>
            </Text>
          </Box>
        }
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <TreeListBody />
        </React.Suspense>
      </ErrorBoundary>
    </Stack>
  );
}
