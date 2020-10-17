import { Column } from "react-table";
import { DefaultColumnFilter } from "./Filter";
import { ActionsCell, DateCell, TagCell } from "./SpecialCells";

export const columns: Column<Record<string, unknown>>[] = [
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
    Cell: TagCell,
  },
  {
    Header: "ERSTELLT",
    accessor: "createdAt",
    filter: "fuzzyText",
    width: 100,
    Cell: DateCell,
  },
  {
    Header: "BEARBEITEN",
    accessor: "id",
    disableSortBy: true,
    Cell: ActionsCell,
  },
];

export const defaultColumn = {
  minWidth: 30,
  width: 150,
  maxWidth: 800,
  Filter: DefaultColumnFilter,
};
