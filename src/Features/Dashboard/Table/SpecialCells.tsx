//TODO type the cell functions correctly remove next line to see the errors
/* eslint-disable @typescript-eslint/no-explicit-any */
/**@jsx jsx */
import { Box, Flex, IconButton, jsx } from "theme-ui";
import React from "react";
import { Tags } from "../Tag";
import { AddBoxTwoTone, DeleteTwoTone, EditTwoTone } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { parseISO, formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import { CellProps } from "react-table";
import { Tag } from "../../../types/global";

export const TagCell: React.FC<CellProps<Tag>> = ({ cell: { value } }) => (
  <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
    {value && (
      <React.Fragment>
        <Tags values={value} />
        <IconButton>
          <AddBoxTwoTone />
        </IconButton>
      </React.Fragment>
    )}
  </Flex>
);

export const DateCell: React.FC<CellProps<any>> = ({ cell: { value } }) => (
  <span>{formatWithOptions({ locale: de })("P")(parseISO(value))}</span>
);

export const ActionsCell: React.FC<CellProps<any>> = ({ cell: { value } }) => {
  return (
    <Box sx={{ "& > *:not(:last-child)": { mr: 3 } }}>
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
};
