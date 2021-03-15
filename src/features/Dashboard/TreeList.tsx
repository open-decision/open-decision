import { Badge, Button } from "components";
import React from "react";
import { parseISO, formatWithOptions } from "date-fns/esm/fp";
import de from "date-fns/locale/de";
import {
  ChevronDownSolid,
  PlusCircleOutline,
} from "@graywolfai/react-heroicons";
import { fuzzySearch, Search, sortByKey } from "./Filter";
import { motion } from "framer-motion";
import { ValidTreeNode } from "./types";
import { identity, pipe } from "remeda";
import { Link } from "react-router-dom";

type TreeCard = { tree: ValidTreeNode };

const TreeCard: React.FC<TreeCard> = ({ tree }) => (
  <div className="bg-gray-50 rounded-md shadow-md space-y-2 hover:shadow-lg transition-all duration-100 border-l-4 border-primary-500">
    <div className="space-x-4 px-4 py-2 flex items-center">
      {tree.tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} className="shadow-sm">
          {tag.name}
        </Badge>
      ))}
      <Button rounded="full" variant="icon" size="small">
        <PlusCircleOutline className="w-6 h-6" />
      </Button>
    </div>

    <div className="px-4 pb-4 flex items-baseline">
      <div className="space-y-2 flex-grow">
        <h3 className="text-4xl">{tree.name}</h3>
        <span className="text-gray-500 text-sm">
          {formatWithOptions({ locale: de })("P")(parseISO(tree.createdAt))}
        </span>
      </div>
      <div className="flex self-end">
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-red-700 mr-4"
        >
          Archivieren
        </Button>
        <Button outlined as={Link} to="/builder">
          Öffnen
        </Button>
      </div>
    </div>
  </div>
);

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
      rounded="none"
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

type TreeList = { data: ValidTreeNode[] };
type sortState = { key: string; descending: boolean };

const sortData = (sort: sortState) => (data: ValidTreeNode[]) =>
  sort.descending
    ? sortByKey(data, sort.key)
    : sortByKey(data, sort.key).reverse();

const filterData = (filter: string) => (data: ValidTreeNode[]) =>
  fuzzySearch(data, filter);

export const TreeList: React.FC<TreeList> = ({ data }) => {
  const [filter, setFilter] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  const [sort, setSort] = React.useState<sortState>({
    key: "",
    descending: true,
  });

  React.useEffect(() => {
    const modifiedData = pipe(
      data,
      filter ? filterData(filter) : identity,
      sort.key ? sortData(sort) : identity
    );

    setFilteredData(modifiedData);
  }, [data, filter, sort]);

  return (
    <div className="space-y-8 my-12">
      <h2 className="text-xl font-bold">Ihre Anwendungen</h2>
      <Search setValue={setFilter} value={filter} className="mt-4" />
      <div>
        <div className="flex items-center">
          Sortieren nach:{" "}
          <SortButton sort={sort} setSort={setSort} name="name" label="Name" />
          <SortButton
            sort={sort}
            setSort={setSort}
            name="createdAt"
            label="Datum"
          />
        </div>
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
