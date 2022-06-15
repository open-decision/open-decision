import { matchSorter } from "match-sorter";
import { readableDate } from "../utils";
import { parseISO } from "date-fns";
import { TGetTreesOutput } from "@open-decision/tree-api-specification";

export const fuzzySearch = (data: TGetTreesOutput, search: string): any[] => {
  return matchSorter(data, search, {
    keys: ["name", (data) => readableDate(parseISO(data.updatedAt))],
  });
};

export const sortByKey = (data: any[], key: string): any[] => {
  return matchSorter(data, "", { keys: [key] });
};

export const filterStatus = (data: any[], filter: string): any[] => {
  return matchSorter(data, filter, { keys: ["status"] });
};
