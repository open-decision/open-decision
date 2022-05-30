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
  filterOptions: TFilterOptions
) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<keyof TFilterOptions>("");
  const [sort, setSort] = React.useState<keyof TSortOptions>(initialSortOption);
  const [direction, setDirection] = React.useState<SortDirections>("ascending");

  const [filteredData, setFilteredData] = React.useState<any[]>([]);

  const handleFilterChange = React.useCallback(
    function handleFilterChange() {
      const modifiedData = pipe(
        data,
        search ? searchData(search) : identity,
        filter ? filterData(filter as string) : identity,
        sort ? sortData(sort as string, direction) : identity
      );

      setFilteredData(modifiedData);
    },
    [data, search, filter, sort, direction]
  );

  React.useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  const SortButton = React.useCallback(
    () => (
      <GenericSortButton
        sort={sort as string}
        direction={direction}
        options={sortOptions}
        setDirection={setDirection}
        setSort={setSort}
      />
    ),
    [direction, sort, sortOptions]
  );

  const FilterButton = React.useCallback(
    () => (
      <GenericFilterButton
        options={filterOptions}
        setFilter={(newFilter) =>
          newFilter === filter ? setFilter("") : setFilter(newFilter)
        }
        filter={filter as string}
      />
    ),
    [filter, filterOptions]
  );

  return {
    filteredData,
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
