import * as React from "react";
import { Label } from "../../Label/Label";
import { styled, StyleObject } from "../../stitches";
import { Box } from "../../Box";

import { ValidationMessage } from "../shared/ValidationMessage";

const FieldBox = styled("div", {
  display: "grid",
  gap: "$2",
});

export type FieldProps = {
  label: string;
  children: JSX.Element;
  css?: StyleObject;
};

export function Field({ label, children, css }: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  const name = children.props?.name;

  if (!name) {
    throw new Error("The Input inside of a Field needs a name.");
  }

  return (
    <FieldBox css={css}>
      <Label size="small">
        <Box css={{ marginBottom: "$2", display: "block" }} as="span">
          {label}
        </Box>
        {children}
      </Label>
      <ValidationMessage name={name} css={{ gridColumn: "1/ -1" }} />
    </FieldBox>
  );
}
