import React, { ReactElement } from "react";
import {
  FilterProps,
  FilterValue,
  IdType,
  Row,
  useAsyncDebounce,
} from "react-table";
import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns/esm";
import { Component, Tag } from "@internalTypes/global";
import { Field, Input } from "@components/index";

type GlobalFilter = {
  globalFilter: FilterValue;
  setGlobalFilter: (filterValue: string) => void;
};

export const GlobalFilter: Component<GlobalFilter> = ({
  globalFilter,
  setGlobalFilter,
  ...props
}) => {
  const setValue = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Field
      layout="inline"
      name="search"
      label="Suche: "
      value={globalFilter || ""}
      setValue={setValue}
      {...props}
    />
  );
};

export function fuzzyGlobalFilter(
  rows: Row[],
  filterValue: FilterValue
): Row[] {
  return matchSorter(rows, filterValue.trim(), {
    keys: [
      "values.name",
      (row) => readableDate(parseISO(row.values.createdAt)),
      (row) => row.values.tags.map((tag: Tag) => tag.name),
    ],
  });
}

export function fuzzyTextFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => row.values[id]],
  });
}

fuzzyTextFilter.autoRemove = (val: string) => !val;

export function DefaultColumnFilter<T extends Record<string, unknown>>({
  column: { filterValue, setFilter },
}: FilterProps<T>): ReactElement {
  return <Input value={filterValue || ""} setValue={setFilter} />;
}

// export function TagFilter<T extends Record<string, unknown>>(
//   rows: Array<Row<T>>,
//   id: IdType<T>,
//   filterValue: FilterValue
// ): Array<Row<T>> {
//   return filter(pipe(getTags, includes(filterValue)))(rows);
// }

// TagFilter.autoRemove = (val: any) => !val;

export const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  // tags: TagFilter,
};
