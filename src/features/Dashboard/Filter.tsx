import React from "react";
import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns";
import { InlinedValidTreeNode, Tag } from "./types";

type GlobalFilter = {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Search: React.FunctionComponent<GlobalFilter> = ({
  value,
  setValue,
  ...props
}) => (
  <div></div>
  // <Field
  //   layout="inline"
  //   name="search"
  //   label="Suche: "
  //   value={value || ""}
  //   onChange={(e) => setValue(e.target.value)}
  //   {...props}
  // />
);

export const fuzzySearch = (
  data: InlinedValidTreeNode[],
  filterValue: string
): InlinedValidTreeNode[] => {
  return matchSorter(data, filterValue, {
    keys: [
      "name",
      (data) => readableDate(parseISO(data.createdAt)),
      (data) => data.tags.map((tag: Tag) => tag.name),
    ],
  });
};

export const sortByKey = (
  data: InlinedValidTreeNode[],
  key: string
): InlinedValidTreeNode[] => {
  return matchSorter(data, "", { keys: [key] });
};
