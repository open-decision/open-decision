import * as React from "react";
import { Label } from "../../Label/Label";
import { styled, StyleObject } from "../../stitches";

import { ValidationMessage } from "../shared/ValidationMessage";

const FieldBox = styled("div", {
  display: "grid",
  gap: "$2",
});

export type FieldProps = {
  label: string;
  children: React.ReactElement;
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

  const EnhancedInput = React.cloneElement(children, {
    id: name,
  });

  return (
    <FieldBox css={css}>
      <Label htmlFor={name} size="small">
        {label}
      </Label>
      {EnhancedInput}
      <ValidationMessage name={name} css={{ gridColumn: "1/ -1" }} />
    </FieldBox>
  );
}
