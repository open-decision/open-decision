import { format } from "date-fns";
import de from "date-fns/locale/de";
import { pipe, prop, map, flatten, uniq } from "remeda";
import { ValidTreeNode } from "./types";
export const readableDate = (date: Date): string =>
  format(date, "P", { locale: de });
export const getTags = (data: ValidTreeNode): string[] =>
  pipe(data, prop("tags"), map(prop("name")));
export const filterTags = (data: ValidTreeNode[]): string[] =>
  pipe(data, map(getTags), flatten(), uniq());
