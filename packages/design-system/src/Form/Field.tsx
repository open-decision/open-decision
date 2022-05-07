import * as React from "react";
import { v4 as uuid } from "uuid";
import { Label } from "./Label";
import { styled, StyleObject } from "../stitches";

import { ValidationMessage } from "./ValidationMessage";
import { visuallyHidden } from "../shared/utils";
import { Box } from "../Box";

const FieldBox = styled(Box, {
  display: "grid",
  maxWidth: "max-content",
  gap: "$2",
  gridTemplateAreas: `"label" "input"`,

  "&[data-error='true']": {
    gridTemplateAreas: `"label" "input" "error"`,
  },

  "&[data-layout='inline-left']": {
    gridTemplateAreas: `"label input"`,

    "&[data-error='true']": {
      gridTemplateAreas: `"label input" "error error"`,
    },
  },
  "&[data-layout='inline-right']": {
    gridTemplateAreas: `"input label"`,

    "&[data-error='true']": {
      gridTemplateAreas: `"input label" "error error"`,
    },
  },
});

export type FieldProps = {
  label: React.ReactNode;
  isLabelVisible?: boolean;
  children: JSX.Element;
  css?: StyleObject;
  name?: string;
  errors?: string[];
  layout?: "block" | "inine-left" | "inline-right";
};

export function Field({
  label,
  children,
  css,
  errors,
  isLabelVisible = true,
  layout = "block",
}: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  const [id] = React.useState(uuid());
  const EnhancedInput = React.cloneElement(children, {
    id,
    css: { ...children.props?.css, gridArea: "input" },
  });

  return (
    <FieldBox css={css} data-layout={layout} data-error={Boolean(errors)}>
      <Label
        css={{ gridArea: "label" }}
        className={isLabelVisible ? "" : visuallyHidden()}
        htmlFor={id}
      >
        {label}
      </Label>
      {EnhancedInput}
      <ValidationMessage errors={errors} css={{ gridArea: "error" }} />
    </FieldBox>
  );
}
