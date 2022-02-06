import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns";
import { TreesQuery } from "features/Data/generated/graphql";

// FIXME Remove the any types when it is clear what shape the metadata return from the API has
export const fuzzySearch = (
  data: TreesQuery["decisionTrees"],
  filterValue: string
): any[] => {
  return matchSorter(data, filterValue, {
    keys: [
      "name",
      (data) => readableDate(parseISO(data.updatedAt)),
      // (data) => data.tags.map((tag) => tag.name),
    ],
  });
};

export const sortByKey = (data: any[], key: string): any[] => {
  return matchSorter(data, "", { keys: [key] });
};
