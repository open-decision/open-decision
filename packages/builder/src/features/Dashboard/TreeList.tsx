import React from "react";
import { fuzzySearch, sortByKey } from "./filter";
import { motion } from "framer-motion";
import { identity, pipe } from "remeda";
import {
  Button,
  DropdownMenu,
  Field,
  Icon,
  Input,
  Stack,
  useForm,
} from "@open-decision/design-system";
import { ChevronUp, Search } from "react-feather";
import { TreesQuery } from "features/Data/generated/graphql";
import { TreeCard } from "./TreeCard";

const sortReadableNames = {
  updatedAt: "Zuletzt bearbeitet",
  createdAt: "Erstellungsdatum",
};

const sortDirectionReadableNames = {
  descending: "Absteigend",
  ascending: "Aufsteigend",
};

type TreeListProps = { data: TreesQuery["decisionTrees"] };
type sortState = { key: string; direction: "ascending" | "descending" };

const sortData = (sort: sortState) => (data: any[]) =>
  sort.direction === "descending"
    ? sortByKey(data, sort.key)
    : sortByKey(data, sort.key).reverse();

const filterData = (filter: string) => (data: any[]) =>
  fuzzySearch(data, filter);

export const TreeList = ({ data }: TreeListProps) => {
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
      const modifiedData = pipe(
        data,
        filter ? filterData(filter) : identity,
        sort.key ? sortData(sort) : identity
      );

      setFilteredData(modifiedData);
    },
    [data, filter, sort]
  );

  React.useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
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
          <motion.div key={tree.id} layout transition={{ duration: 0.5 }}>
            <TreeCard tree={tree} />
          </motion.div>
        ))}
      </Stack>
    </>
  );
};
