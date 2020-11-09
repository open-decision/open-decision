import React from "react";

//Components
import { fuzzyGlobalFilter, GlobalFilter, filterTypes } from "./Filter";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFlexLayout,
  Column,
} from "react-table";
import { Component, TreeNodes } from "@internalTypes/global";

type TableProps = {
  data: TreeNodes;
  columns: Column[];
  defaultColumn: Partial<Column>;
};

export const Table: Component<TableProps> = ({
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
    <>
      <GlobalFilter
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        className="mt-4"
      />
      <div {...getTableProps()} className="w-full">
        <div>
          {headerGroups.map((headerGroup) => (
            // a key is produced by ...headerGroup.getHEaderGroupProps(), but that confuses eslint
            // eslint-disable-next-line react/jsx-key
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <h2
                  className="my-3"
                  key={column.id}
                  {...column.getHeaderProps([column.getSortByToggleProps()])}
                >
                  {column.render("Header")}
                  {column.canSort && (
                    <span className="ml-2">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "⬇"
                          : "⬆"
                        : "⬅"}
                    </span>
                  )}
                </h2>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="my-2" key={row.id}>
                {row.cells.map((cell) => {
                  return (
                    <span
                      className="flex, items-center"
                      {...cell.getCellProps()}
                      key={cell.value}
                    >
                      {cell.render("Cell")}
                    </span>
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
