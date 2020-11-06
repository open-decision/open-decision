//TODO type the cell functions correctly remove next line to see the errors
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tags } from "./Tag";
import { parseISO, formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import { CellProps } from "react-table";
import { Tag } from "@internalTypes/global";
import { IconButton, IconLink } from "@components/index";
import {
  PlusCircleOutline,
  PencilOutline,
  TrashOutline,
} from "@graywolfai/react-heroicons";

export const TagCell: React.FC<CellProps<Tag>> = ({ cell: { value } }) => (
  <div className="justify-between">
    {value && <Tags values={value} />}
    <IconButton>
      <PlusCircleOutline className="w-6 h-6" />
    </IconButton>
  </div>
);

export const DateCell: React.FC<CellProps<any, string>> = ({
  cell: { value },
}) => <span>{formatWithOptions({ locale: de })("P")(parseISO(value))}</span>;

export const ActionsCell: React.FC<CellProps<any, string>> = ({
  cell: { value },
}) => (
  <div className="space-x-3 flex ">
    <IconLink to={`/builder/${value}`} className="inline">
      <PencilOutline className="w-6 h-6" />
    </IconLink>
    <IconButton className="inline">
      <TrashOutline className="w-6 h-6" />
    </IconButton>
  </div>
);
