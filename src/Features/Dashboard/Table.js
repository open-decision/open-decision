/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
/**@jsx jsx */
import { jsx } from "theme-ui";
import React from "react";

//Components
import { Text, Label, Flex, Input, Select, Heading, Box, IconButton } from "theme-ui";
import { Tags } from "./Tag";
import { EditTwoTone, DeleteTwoTone, AddBoxTwoTone } from "@material-ui/icons";

//Hooks and functions for the table logic => not UI components
import { useTable, useSortBy, useGlobalFilter, useAsyncDebounce, useFilters, useFlexLayout } from "react-table";
import matchSorter from "match-sorter";

//date manipulation to make the creation date friendlier
import { parseISO, formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import { pipe, map, path, prop, flatten, uniq, includes, filter } from "ramda";
import { Link } from "react-router-dom";

//Data transformation functions
//{row} => [String]
const getTags = pipe(path(["values", "tags"]), map(prop("name")));
//{rows} => [String]
const filterTags = pipe(map(getTags), flatten, uniq);

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Flex sx={{ py: 3, alignItems: "center" }}>
      <Label htmlFor="search" sx={{ flex: "0", mr: 4, minWidth: "max-content" }}>
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

function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows } }) {
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
      (row) => formatWithOptions({ locale: de })("P")(parseISO(row.values.createdAt)),
      (row) => row.values.tags.map((tag) => tag.name),
    ],
  });
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

export const Table = ({ className = "", data }) => {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      tags: (rows, id, filterValue) => {
        console.log(filterValue);
        return filter(pipe(includes(filterValue), getTags))(rows);
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
        disableSortBy: true,
        width: 200,
        Cell: ({ cell: { value } }) => {
          return (
            <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
              {value && (
                <>
                  <Tags values={value} />
                  <IconButton>
                    <AddBoxTwoTone />
                  </IconButton>
                </>
              )}
            </Flex>
          );
        },
        Filter: SelectColumnFilter,
      },
      {
        Header: "ERSTELLT",
        accessor: "createdAt",
        filter: "fuzzyText",
        width: 100,
        style: { textAlign: "right" },
        Cell: ({ cell: { value } }) => {
          return <span>{formatWithOptions({ locale: de })("P")(parseISO(value))}</span>;
        },
      },
      {
        Header: "BEARBEITEN",
        accessor: "id",
        disableSortBy: true,
        style: { textAlign: "right" },
        Cell: ({ cell: { value } }) => {
          return (
            <Box
              sx={{
                "& > *:not(:last-child)": {
                  mr: 3,
                },
              }}
            >
              <Link
                to={`/builder/${value}`}
                sx={{
                  textDecoration: "none",
                  color: "initial",
                  ":hover": { color: "primary" },
                }}
              >
                <EditTwoTone />
              </Link>
              <DeleteTwoTone sx={{ ":hover": { color: "red" } }} />
            </Box>
          );
        },
      },
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 800,
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
    useFlexLayout,
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
      <div
        {...getTableProps()}
        sx={{
          width: "100%",
        }}
        className={className}
      >
        {/* <Heading variant="headingLarge" as="caption" sx={{ textAlign: "left" }}>
          Entscheidungsbäume
        </Heading> */}
        <div>
          {/* Loop over the header rows */}
          {headerGroups.map((headerGroup) => (
            // Apply the header row props
            <div {...headerGroup.getHeaderGroupProps()}>
              {/* Loop over the headers in each row */}
              {headerGroup.headers.map((column) => (
                // Apply the header cell props
                <Heading
                  {...column.getHeaderProps([
                    {
                      style: column.style,
                    },
                    column.getSortByToggleProps(),
                  ])}
                  sx={{ my: 3 }}
                >
                  {/* Render the header */}
                  {column.render("Header")}
                  {column.canSort && (
                    <span sx={{ ml: 2 }}>{column.isSorted ? (column.isSortedDesc ? "⬇" : "⬆") : "⬅"}</span>
                  )}
                  {/* Render the columns filter UI */}
                  {/* <div sx={{ py: 2, pr: 4 }}>
                    {column.canFilter ? column.render("Filter") : null}
                  </div> */}
                </Heading>
              ))}
            </div>
          ))}
        </div>

        {/* Apply the table body props */}
        <div {...getTableBodyProps()}>
          {/* Loop over the table rows */}
          {rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <div {...row.getRowProps()} sx={{ my: 2 }}>
                {/* Loop over the rows cells */}
                {row.cells.map((cell) => {
                  // Apply the cell props
                  return (
                    <Text
                      {...cell.getCellProps([
                        {
                          style: cell.column.style,
                        },
                      ])}
                    >
                      {/* Render the cell contents */}
                      {cell.render("Cell")}
                    </Text>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
