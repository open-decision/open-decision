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
} from "@open-legal-tech/design-system";
import { Search, Sliders, TrendingDown, TrendingUp } from "react-feather";
import { TreesQuery } from "features/Data/generated/graphql";
import { TreeCard } from "./TreeCard";

type TreeListProps = { data: TreesQuery["decisionTrees"] };
type sortState = { key: string; descending: boolean };

const sortData = (sort: sortState) => (data: any[]) =>
  sort.descending
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
    descending: false,
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

  const handleSort = (key: string) =>
    setSort({
      key,
      descending: sort.key === key ? !sort.descending : sort.descending,
    });

  const CheckboxIcon = sort.descending ? (
    <Icon size="small">
      <TrendingDown />
    </Icon>
  ) : (
    <Icon size="small">
      <TrendingUp />
    </Icon>
  );

  return (
    <>
      <Form
        onSubmit={handleFilterChange}
        css={{ display: "flex", gap: "$2", justifyContent: "space-between" }}
      >
        <Field
          label="Suche"
          isLabelVisible={false}
          css={{ flexBasis: "400px", backgroundColor: "white" }}
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
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" css={{ gap: "$3" }}>
              <span>current filter</span>
              <Icon>
                <Sliders />
              </Icon>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            <DropdownMenu.CheckboxItem
              Icon={CheckboxIcon}
              checked={sort.key === "updatedAt"}
              onSelect={() => handleSort("updatedAt")}
            >
              Zuletzt bearbeitet
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              Icon={CheckboxIcon}
              checked={sort.key === "createdAt"}
              onSelect={() => handleSort("createdAt")}
            >
              Erstellungsdatum
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem disabled>
              Nur fertige Projekte
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem disabled>
              Nur unfertige Projekte
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem disabled>
              Nur veröffentlichte Projekte
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem disabled>
              Nur unveröffentlichte Projekte
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Form>
      <Stack
        css={{
          gap: "$4",
          marginTop: "$1",
          overflow: "auto",
          paddingBlock: "$4",
          paddingRight: "$4",
          marginRight: "-$4",
        }}
      >
        {filteredData.map((tree) => (
          <motion.div key={tree.id} layout>
            <TreeCard tree={tree} />
          </motion.div>
        ))}
      </Stack>
    </>
  );
};
