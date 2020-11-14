import React from "react";
import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns/esm";
import { Component, Tag, TreeNode } from "@internalTypes/global";
import { Field } from "@components/index";

type GlobalFilter = {
  value: string;
  setValue: (filterValue: string) => void;
};

export const Search: Component<GlobalFilter> = ({
  value,
  setValue,
  className,
  ...props
}) => {
  // const debouncedFilter = useAsyncDebounce((value) => {
  //   setValue(value || undefined);
  // }, 200);

  // const onChange = (value) => {
  //   setValue(value);
  //   // debouncedFilter(value);
  // };

  return (
    <Field
      //FIXME related to Tailwind vs code extension => classNames as a prop does not trigger autocomplete => https://github.com/tailwindlabs/tailwindcss-intellisense/issues/129
      //class="
      classNames={{
        box: className,
        input: "bg-gray-100 border-2 border-gray-300 shadow-inner",
      }}
      // "
      layout="inline"
      name="search"
      label="Suche: "
      value={value || ""}
      setValue={setValue}
      {...props}
    />
  );
};

export const fuzzySearch = (
  data: TreeNode[],
  filterValue: string
): TreeNode[] => {
  console.log("filter:", data);
  return matchSorter(data, filterValue, {
    keys: [
      "name",
      (data) => readableDate(parseISO(data.createdAt)),
      (data) => data.tags.map((tag: Tag) => tag.name),
    ],
  });
};

export const sortByKey = (data: TreeNode[], key: string) => {
  console.log("sort:", data);
  return matchSorter(data, "", { keys: [key] });
};
