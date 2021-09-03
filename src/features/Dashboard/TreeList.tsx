import React from "react";
import { parseISO, format } from "date-fns";
import de from "date-fns/locale/de";
import { ChevronDownSolid } from "@graywolfai/react-heroicons";
import { fuzzySearch, Search, sortByKey } from "./Filter";
import { motion } from "framer-motion";
import { InlinedValidTreeNode, TreeState } from "./types";
import { identity, pipe } from "remeda";
import { TreeTags } from "./TreeTags";
import {
  Box,
  Button,
  Heading,
  HeadingGroup,
  IconButton,
  Text,
} from "@open-legal-tech/design-system";
import Link from "next/link";
import { mapObjToArr } from "./utils";
import { useTreeStore } from "./hooks/useTrees";
import { TrashIcon } from "@radix-ui/react-icons";

type TreeCard = { tree: InlinedValidTreeNode };

const TreeCard: React.FC<TreeCard> = ({ tree }) => {
  const deleteTree = useTreeStore(
    React.useCallback((state) => state.deleteTree, [])
  );

  return (
    <Box
      css={{ padding: "$4" }}
      className="bg-gray1 rounded-md shadow-md space-y-2 hover:shadow-lg focus-within:shadow-lg transition-all duration-100 border-l-4 border-primary9"
    >
      <TreeTags tree={tree} />

      <div className="flex items-baseline">
        <HeadingGroup.Container className="flex-grow">
          <Heading as="h3" size="sm">
            {tree.name}
          </Heading>
          <HeadingGroup.SubHeading>
            Erstellt am: {format(parseISO(tree.createdAt), "P", { locale: de })}
          </HeadingGroup.SubHeading>
        </HeadingGroup.Container>
        <div className="self-end space-x-4 flex">
          <IconButton
            variant="secondary"
            label="Baum löschen"
            onClick={() => deleteTree(tree.id)}
            css={{ colorScheme: "error" }}
            Icon={<TrashIcon style={{ width: "20px", height: "20px" }} />}
          />
          <Link href={`/builder/${tree.id}`}>
            <Button variant="secondary">Öffnen</Button>
          </Link>
        </div>
      </div>
    </Box>
  );
};

type SortButton = {
  sort: { key: string; descending: boolean };
  setSort: React.Dispatch<
    React.SetStateAction<{
      key: string;
      descending: boolean;
    }>
  >;
  name: string;
  label: string;
};

const SortButton: React.FunctionComponent<SortButton> = ({
  sort,
  setSort,
  name,
  label,
}) => {
  const variants = {
    up: { rotate: 180 },
    down: { rotate: 0 },
    neutral: { rotate: 90 },
  };

  return (
    <Button
      variant="ghost"
      onClick={() =>
        setSort({
          key: name,
          descending: sort.key === name ? !sort.descending : sort.descending,
        })
      }
    >
      {label}
      <motion.span
        variants={variants}
        animate={
          sort.key === name ? (sort.descending ? "up" : "down") : "neutral"
        }
      >
        <ChevronDownSolid className="w-6" />
      </motion.span>
    </Button>
  );
};

type TreeList = { data: TreeState };
type sortState = { key: string; descending: boolean };

const sortData = (sort: sortState) => (data: InlinedValidTreeNode[]) =>
  sort.descending
    ? sortByKey(data, sort.key)
    : sortByKey(data, sort.key).reverse();

const filterData = (filter: string) => (data: InlinedValidTreeNode[]) =>
  fuzzySearch(data, filter);

export const TreeList: React.FC<TreeList> = ({ data }) => {
  const [filter, setFilter] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(mapObjToArr(data));
  const [sort, setSort] = React.useState<sortState>({
    key: "",
    descending: true,
  });

  React.useEffect(() => {
    const arrayData = mapObjToArr(data);

    const modifiedData = pipe(
      arrayData,
      filter ? filterData(filter) : identity,
      sort.key ? sortData(sort) : identity
    );

    setFilteredData(modifiedData);
  }, [data, filter, sort]);

  return (
    <div className="space-y-8 my-12">
      <Heading className="text-xl font-bold">Ihre Anwendungen</Heading>
      <Search setValue={setFilter} value={filter} />
      <div>
        <Text className="flex items-center">
          Sortieren nach:{" "}
          <SortButton sort={sort} setSort={setSort} name="name" label="Name" />
          <SortButton
            sort={sort}
            setSort={setSort}
            name="createdAt"
            label="Datum"
          />
        </Text>
        <div className="space-y-6 mt-2">
          {filteredData.map((tree) => (
            <motion.div key={tree.id} layout>
              <TreeCard tree={tree} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
