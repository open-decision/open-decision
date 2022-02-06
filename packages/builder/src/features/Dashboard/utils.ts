import { format } from "date-fns";
import de from "date-fns/locale/de";
import { pipe, prop, map, flatten, uniq } from "remeda";
export const readableDate = (date: Date): string =>
  format(date, "P", { locale: de });

// FIXME Remove the any types when it is clear what shape the metadata return from the API has

export const getTags = (data: any): string[] =>
  //@ts-expect-error - can be removed when the any is fixed
  pipe(data, prop("tags"), map(prop("name")));

export const filterTags = (data: any[]): string[] =>
  pipe(data, map(getTags), flatten(), uniq());

export type InlinedKey<T> = { id: string } & T;
