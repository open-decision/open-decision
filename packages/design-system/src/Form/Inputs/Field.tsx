import * as React from "react";
import { Label } from "../../Label/Label";
import { styled, StyleObject } from "../../stitches";

import { ValidationMessage } from "../ValidationMessage";
import { visuallyHidden } from "../../shared/utils";

const FieldBox = styled("div", {
  display: "grid",
  gap: "$2",
});

export type FieldProps = {
  label: React.ReactNode;
  isLabelVisible?: boolean;
  children: JSX.Element;
  css?: StyleObject;
  name?: string;
};

export function Field({
  label,
  children,
  css,
  name,
  isLabelVisible = true,
}: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  const inputName = children.props?.name ?? name;

  if (!inputName) {
    throw new Error(
      "The Input inside of a Field needs a name. If the Input is not a direct child of the Field then pass the same name to the Field component"
    );
  }

  const EnhancedInput = React.cloneElement(children, {
    id: inputName,
  });

  return (
    <FieldBox css={css}>
      <Label
        size="small"
        css={{
          marginBottom: "$2",
          display: "block",
        }}
        className={isLabelVisible ? "" : visuallyHidden()}
        htmlFor={inputName}
      >
        {label}
      </Label>
      {EnhancedInput}
      <ValidationMessage name={inputName} css={{ gridColumn: "1/ -1" }} />
    </FieldBox>
  );
}
