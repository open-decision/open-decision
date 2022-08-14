import * as React from "react";
import { identity, pipe } from "remeda";
import { filterStatus, fuzzySearch, sortByKey } from "./filter";
import { SortButton as GenericSortButton } from "./SortButton";
import { FilterButton as GenericFilterButton } from "./FilterButton";

export type SortDirections = "ascending" | "descending";

const sortData = (sort: string, direction: SortDirections) => (data: any[]) =>
  direction === "descending"
    ? sortByKey(data, sort)
    : sortByKey(data, sort).reverse();

const searchData = (search: string) => (data: any[]) =>
  fuzzySearch(data, search);

const filterData = (filter: string) => (data: any[]) =>
  filterStatus(data, filter);

export function useFilter<
  TSortOptions extends Record<string, string>,
  TFilterOptions extends Record<string, string>
>(
  data: any[],
  sortOptions: TSortOptions,
  initialSortOption: keyof TSortOptions,
  filterOptions: TFilterOptions,
  defaultFilter?: string
) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<keyof TFilterOptions>(
    defaultFilter ?? ""
  );
  const [sort, setSort] = React.useState<keyof TSortOptions>(initialSortOption);
  const [direction, setDirection] = React.useState<SortDirections>("ascending");

  const handleFilterChange = React.useCallback(
    function handleFilterChange() {
      return pipe(
        data,
        search ? searchData(search) : identity,
        filter ? filterData(filter as string) : identity,
        sort ? sortData(sort as string, direction) : identity
      );
    },
    [data, search, filter, sort, direction]
  );

  const SortButton = React.useCallback(
    () => (
      <GenericSortButton
        sort={sort as string}
        direction={direction}
        options={sortOptions}
        setDirection={(direction) => {
          setDirection(direction);
          handleFilterChange();
        }}
        setSort={(option) => {
          setSort(option);
          handleFilterChange();
        }}
      />
    ),
    [direction, sort, sortOptions, handleFilterChange]
  );

  const FilterButton = React.useCallback(
    () => (
      <GenericFilterButton
        options={filterOptions}
        setFilter={(newFilter) => {
          newFilter === filter
            ? setFilter(defaultFilter ?? "")
            : setFilter(newFilter);
          return handleFilterChange();
        }}
        filter={filter}
        defaultFilter={defaultFilter}
      />
    ),
    [defaultFilter, filter, filterOptions, handleFilterChange]
  );

  return {
    filteredData: handleFilterChange(),
    search,
    filter,
    sort,
    direction,
    SortButton,
    FilterButton,
    setDirection,
    setSearch,
    setFilter,
    setSort,
  };
}
