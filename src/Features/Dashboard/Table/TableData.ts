import { DefaultColumnFilter } from "./Filter";
import { ActionsCell, DateCell, TagCell } from "./SpecialCells";

export const columns = [
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
    // Filter: SelectColumnFilter,
  },
  {
    Header: "ERSTELLT",
    accessor: "createdAt",
    filter: "fuzzyText",
    width: 100,
    style: { textAlign: "right" },
    Cell: DateCell,
  },
  {
    Header: "BEARBEITEN",
    accessor: "id",
    disableSortBy: true,
    style: { textAlign: "right" },
    Cell: ActionsCell,
  },
];

export const defaultColumn = {
  minWidth: 30,
  width: 150,
  maxWidth: 800,
  Filter: DefaultColumnFilter,
};
