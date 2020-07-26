/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
import React from "react";

//Components
import { Text, Label, Flex, Input, Select } from "theme-ui";
import { Tags } from "components";

//Hooks and functions for the table logic => not UI components
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
} from "react-table";
import matchSorter from "match-sorter";

//date manipulation to make the creation date friendlier
import { parseISO, formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import {
  compose,
  map,
  path,
  prop,
  flatten,
  uniq,
  includes,
  filter,
} from "ramda";

//Data transformation functions
//{row} => [String]
const getTags = compose(map(prop("name")), path(["values", "tags"]));
//{rows} => [String]
const filterTags = compose(uniq, flatten, map(getTags));

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Flex sx={{ py: 3, alignItems: "center" }}>
      <Label htmlFor="search" sx={{ flexBasis: "max-content", mr: 4 }}>
        Suche:
      </Label>
      <Input
        id="search"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        sx={{
          fontSize: "1.1rem",
          border: "0",
          flex: "1",
        }}
      />
    </Flex>
  );
};

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = filterTags(preFilteredRows);

  // Render a multi-select box
  return (
    <Select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}

function fuzzyGlobalFilter(rows, id, filterValue) {
  return matchSorter(rows, filterValue.trim(), {
    keys: [
      "values.name",
      (row) =>
        formatWithOptions({ locale: de })("P")(parseISO(row.values.createdAt)),
      (row) => row.values.tags.map((tag) => tag.name),
    ],
  });
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

export const Table = ({ className, data }) => {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      tags: (rows, id, filterValue) => {
        console.log(filterValue);
        return filter(compose(includes(filterValue), getTags))(rows);
      },
    }),
    []
  );

  //This defines the table columns. The data is passed in. The accessor is the property in each object in data.
  const columns = React.useMemo(
    () => [
      {
        Header: "NAME",
        accessor: "name",
        filter: "fuzzyText",
      },
      {
        Header: "TAGS",
        accessor: "tags",
        filter: "tags",
        Cell: ({ cell: { value } }) => <Tags values={value} />,
        Filter: SelectColumnFilter,
      },
      {
        Header: "ERSTELLT",
        accessor: "createdAt",
        filter: "fuzzyText",
        Cell: ({ cell: { value } }) => {
          return (
            <span>
              {formatWithOptions({ locale: de })("P")(parseISO(value))}
            </span>
          );
        },
      },
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  //This Hook provides the functionality of the table. The general idea is that columns and data are combined and the Hook takes care of returning us only the data that we need based on Sorting and Filtering. We destructure the props used to translate the data returned into UI components. The Hook itself does not influence the UI.
  const {
    //getTableProps is a function to resolve any props needed by the table wrapper.
    getTableProps,
    //getTableBodyProps is a function to resolve any props needed by the table body wrapper.
    getTableBodyProps,
    //prepareRow is a function that must be called on any rows to be displayed. It is responsible for lazily preparing a row for rendering.
    prepareRow,
    //headerGroups and rows are internal data structures derived from columns and data.
    headerGroups,
    rows,
    setGlobalFilter,
    state,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      globalFilter: fuzzyGlobalFilter,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  //Here we use the information provided by useTable (and associated hooks) to display an interactive table UI
  return (
    <>
      {/* This is the Search Field */}
      <GlobalFilter
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
        preGlobalFilteredRows={preGlobalFilteredRows}
      />
      {/* apply the table props */}
      <table
        {...getTableProps()}
        sx={{
          borderCollapse: "seperate",
          borderSpacing: "0 1em",
          width: "100%",
        }}
        className={className}
      >
        <thead>
          {/* Loop over the header rows */}
          {headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {/* Loop over the headers in each row */}
              {headerGroup.headers.map((column) => (
                // Apply the header cell props
                <Text
                  as="th"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {/* Render the header */}
                  {column.render("Header")}
                  <span sx={{ ml: 2 }}>
                    {column.isSorted ? (column.isSortedDesc ? "⬇" : "⬆") : "⬅"}
                  </span>
                  {/* Render the columns filter UI */}
                  <div sx={{ py: 2 }}>
                    {column.canFilter ? column.render("Filter") : null}
                  </div>
                </Text>
              ))}
            </tr>
          ))}
        </thead>

        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {/* Loop over the table rows */}
          {rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {/* Loop over the rows cells */}
                {row.cells.map((cell) => {
                  // Apply the cell props
                  return (
                    <Text as="td" {...cell.getCellProps()}>
                      {/* Render the cell contents */}
                      {cell.render("Cell")}
                    </Text>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
