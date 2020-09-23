/**@jsx jsx */
import { jsx } from "theme-ui";
import React, { FunctionComponent } from "react";

//Components
import { Text, Heading } from "theme-ui";
import { fuzzyGlobalFilter, GlobalFilter, filterTypes } from "./Filter";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFlexLayout,
  Column,
} from "react-table";
import { treeObject, GlobalProps } from "types/global";

type TableProps = {
  data: treeObject[];
  columns: Column[];
  defaultColumn: Partial<Column>;
} & GlobalProps;

export const Table: FunctionComponent<TableProps> = ({
  className,
  data,
  columns,
  defaultColumn,
}) => {
  const {
    setGlobalFilter,
    state: { globalFilter },
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
  } = useTable(
    {
      data,
      columns,
      filterTypes,
      defaultColumn,
      globalFilter: fuzzyGlobalFilter,
    },
    useFlexLayout,
    useGlobalFilter,
    useSortBy
  );

  return (
    <React.Fragment>
      <GlobalFilter
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />
      <div
        {...getTableProps()}
        sx={{
          width: "100%",
        }}
        className={className}
      >
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <Heading
                  key={column.id}
                  {...column.getHeaderProps([column.getSortByToggleProps()])}
                  sx={{ my: 3 }}
                >
                  {column.render("Header")}
                  {column.canSort && (
                    <span sx={{ ml: 2 }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "⬇"
                          : "⬆"
                        : "⬅"}
                    </span>
                  )}
                </Heading>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} sx={{ my: 2 }} key={row.id}>
                {row.cells.map((cell) => {
                  return (
                    <Text {...cell.getCellProps()} key={cell.row.id}>
                      {cell.render("Cell")}
                    </Text>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
