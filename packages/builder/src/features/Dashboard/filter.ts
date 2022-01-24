import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns";
import { InlinedValidTreeNode, Tag } from "./types";

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
