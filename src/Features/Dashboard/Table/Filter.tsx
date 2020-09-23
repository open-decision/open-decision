/**@jsx jsx */
import { ReactElement } from "react";
import {
  FilterProps,
  FilterValue,
  IdType,
  Row,
  useAsyncDebounce,
} from "react-table";
import { jsx, Flex, Input, Label } from "theme-ui";
import matchSorter from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns/esm";
import { Tag } from "types/global";

export const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: FilterValue;
  setGlobalFilter: (filterValue: string) => void;
}): ReactElement => {
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Flex sx={{ py: 3, alignItems: "center" }}>
      <Label
        htmlFor="search"
        sx={{ flex: "0", mr: 4, minWidth: "max-content" }}
      >
        Suche:
      </Label>
      <Input
        id="search"
        value={globalFilter || ""}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        // placeholder={`${count} records...`}
        sx={{
          fontSize: "1.1rem",
          border: "0",
          flex: "1",
        }}
      />
    </Flex>
  );
};

// export const SelectColumnFilter = ({
//   filterValue,
//   setFilter,
//   preFilteredRows,
// }: ColumnInstance): ReactElement => {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = filterTags(preFilteredRows);

//   // Render a multi-select box
//   return (
//     <Select
//       value={filterValue}
//       onChange={(e) => {
//         setFilter(e.target.value || undefined);
//       }}
//     >
//       <option value="">All</option>
//       {options.map((option, i) => (
//         <option key={i} value={option}>
//           {option}
//         </option>
//       ))}
//     </Select>
//   );
// };

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
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    />
  );
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
