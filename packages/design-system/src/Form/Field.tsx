import * as React from "react";
import { styled, StyleObject } from "../stitches";

import { Box } from "../Box";
import { Form } from ".";
import { VisuallyHidden } from "ariakit";

const FieldBox = styled(Box, {
  display: "grid",
  gridTemplateAreas: `"label" "input" "error"`,

  "&[data-layout='inline-left']": {
    gridTemplateAreas: `"label input" "error error"`,
  },

  "&[data-layout='inline-right']": {
    gridTemplateAreas: `"input label" "error error"`,
  },

  "&[data-layout='no-label']": {
    gridTemplateAreas: `"input" "error"`,
  },
});

export type FieldProps = {
  label: React.ReactNode;
  children: JSX.Element;
  css?: StyleObject;
  name?: string;
  layout?: "block" | "inine-left" | "inline-right" | "no-label";
};

export function Field({ label, children, css, layout = "block" }: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  if (!children.props.name)
    throw new Error(`The Field components input child needs a name.`);

  const name = children.props.name;

  const EnhancedInput = React.cloneElement(children, {
    css: { ...children.props?.css, gridArea: "input" },
  });

  const isLabelHidden = layout === "no-label";

  return (
    <FieldBox css={css} data-layout={layout}>
      {isLabelHidden ? (
        <VisuallyHidden>
          <Form.Label name={name}>{label}</Form.Label>
        </VisuallyHidden>
      ) : (
        <Form.Label name={name} css={{ gridArea: "label", marginBottom: "$2" }}>
          {label}
        </Form.Label>
      )}
      {EnhancedInput}
      <Form.Error
        name={name}
        css={{ gridArea: "error", "&:not(:empty)": { marginTop: "$2" } }}
      />
    </FieldBox>
  );
}
