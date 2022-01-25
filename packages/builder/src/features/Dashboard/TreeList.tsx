import React from "react";
import { parseISO, format } from "date-fns";
import de from "date-fns/locale/de";
import { fuzzySearch, sortByKey } from "./filter";
import { motion } from "framer-motion";
import { InlinedValidTreeNode, TreeState } from "./types";
import { identity, pipe } from "remeda";
import { TreeTags } from "./TreeTags";
import {
  Box,
  Button,
  Field,
  Heading,
  HeadingGroup,
  Icon,
  iconStyles,
  Input,
  Reel,
  Stack,
  Text,
  useForm,
} from "@open-legal-tech/design-system";
import Link from "next/link";
import { mapObjToArr } from "./utils";
import { useTreeStore } from "./hooks/useTrees";
import { ChevronDown, Search, Trash } from "react-feather";

type TreeCard = { tree: InlinedValidTreeNode };

const TreeCard: React.FC<TreeCard> = ({ tree }) => {
  const deleteTree = useTreeStore(
    React.useCallback((state) => state.deleteTree, [])
  );

  return (
    <Box
      css={{ padding: "$4", backgroundColor: "$gray1", borderRadius: "$md" }}
    >
      <TreeTags tree={tree} />

      <Stack css={{ alignItems: "baseline" }}>
        <HeadingGroup.Container className="flex-grow">
          <Heading as="h3" size="small">
            {tree.name}
          </Heading>
          <HeadingGroup.SubHeading>
            Erstellt am: {format(parseISO(tree.createdAt), "P", { locale: de })}
          </HeadingGroup.SubHeading>
        </HeadingGroup.Container>
        <Reel css={{ alignSelf: "flex-end", gap: "$4" }}>
          <Button
            variant="secondary"
            onClick={() => deleteTree(tree.id)}
            css={{ colorScheme: "error" }}
          >
            <Icon label="Baum löschen">
              <Trash />
            </Icon>
          </Button>
          <Link href={`/builder/${tree.id}`}>
            <Button variant="secondary">Öffnen</Button>
          </Link>
        </Reel>
      </Stack>
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
      size="small"
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
        className={iconStyles()}
      >
        <ChevronDown />
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

  const [Form] = useForm({
    defaultValues: {
      search: "",
    },
  });

  const handleFilterChange = React.useCallback(
    function handleFilterChange() {
      const arrayData = mapObjToArr(data);

      const modifiedData = pipe(
        arrayData,
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
    <Stack css={{ gap: "$3" }}>
      <Form onSubmit={handleFilterChange} css={{ display: "flex", gap: "$2" }}>
        <Field label="Suche" isLabelVisible={false} css={{ flex: "1" }}>
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
        <Text css={{ display: "flex", alignItems: "center" }}>
          <SortButton sort={sort} setSort={setSort} name="name" label="Name" />
          <SortButton
            sort={sort}
            setSort={setSort}
            name="createdAt"
            label="Datum"
          />
        </Text>
      </Form>
      <Stack css={{ gap: "$4", marginTop: "$1" }}>
        {filteredData.map((tree) => (
          <motion.div key={tree.id} layout>
            <TreeCard tree={tree} />
          </motion.div>
        ))}
      </Stack>
    </Stack>
  );
};
