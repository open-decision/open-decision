/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
import React from "react";

//Components
import { Text } from "theme-ui";
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

import { trace } from "../../utilities";

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
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
};

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = filterTags(preFilteredRows);

  // Render a multi-select box
  return (
    <select
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
    </select>
  );
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
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const tagFilter = (rows, id, filterValue) => {
    return filter(compose(includes(filterValue), getTags))(rows);
  };

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
        Cell: ({ cell: { value } }) => {
          return <Tags values={value} />;
        },
        Filter: SelectColumnFilter,
        filter: tagFilter,
      },
      {
        Header: "ERSTELLT",
        accessor: "createdAt",
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
    visibleColumns,
    setGlobalFilter,
    state,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  //Here we use the information provided by useTable (and associated hooks) to display an interactive table UI
  return (
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
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Text
                as="th"
                {...column.getHeaderProps(column.getSortByToggleProps())}
                sx={{
                  textAlign: "left",
                }}
              >
                {column.render("Header")}
                <span sx={{ ml: 2 }}>
                  {column.isSorted ? (column.isSortedDesc ? "⬇" : "⬆") : "⬅"}
                </span>
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </Text>
            ))}
          </tr>
        ))}
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: "left",
            }}
          >
            <GlobalFilter
              setGlobalFilter={setGlobalFilter}
              globalFilter={state.globalFilter}
              preGlobalFilteredRows={preGlobalFilteredRows}
            />
          </th>
        </tr>
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Text as="td" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Text>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
