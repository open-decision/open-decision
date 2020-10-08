import { formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import { pipe, prop, map, flatten, uniq } from "remeda";
import { Tree } from "types/global";
export const readableDate = (date: Date): string =>
  formatWithOptions({ locale: de })("P")(date);
export const getTags = (data: Tree): string[] =>
  pipe(data, prop("tags"), map(prop("name")));
export const filterTags = (data: Tree[]): string[] =>
  pipe(data, map(getTags), flatten(), uniq());
