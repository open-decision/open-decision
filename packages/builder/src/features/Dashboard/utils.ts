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

export type InlinedKey<T> = { id: string } & T;
export type ArrFromObj<T> = InlinedKey<T>[];

export const mapObjToArr = <T>(obj: Record<string, T>): ArrFromObj<T> => {
  return Object.entries(obj).map(([key, value]) => ({ id: key, ...value }));
};
