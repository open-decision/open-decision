import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns";

// FIXME Remove the any types when it is clear what shape the metadata return from the API has
export const fuzzySearch = (data: any[], filterValue: string): any[] => {
  return matchSorter(data, filterValue, {
    keys: [
      "name",
      (data) => readableDate(parseISO(data.createdAt)),
      (data) => data.tags.map((tag: any) => tag.name),
    ],
  });
};

export const sortByKey = (data: any[], key: string): any[] => {
  return matchSorter(data, "", { keys: [key] });
};
