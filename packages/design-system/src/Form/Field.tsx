import * as React from "react";
import { StyleObject } from "../stitches";

import { Form } from ".";
import { VisuallyHidden } from "ariakit";
import { Stack } from "../Layout";

export type FieldProps = {
  children: JSX.Element;
  css?: StyleObject;
  name?: string;
  Label: React.ReactNode;
  layout?: "block" | "inline-left" | "inline-right" | "no-label";
};

export function Field({ Label, children, css, layout = "block" }: FieldProps) {
  if (!React.Children.only(children)) {
    throw new Error(
      "The Field component can only ever wrap one Input as a child."
    );
  }

  if (!children.props.name)
    throw new Error(`The Field components input child needs a name.`);

  const name = children.props.name;
  const value = children.props.value;

  const EnhancedInput = React.cloneElement(children, {
    id: `${name}-${value}`,
    css: { ...children.props?.css, gridArea: "input" },
  });

  const isLabelHidden = layout === "no-label";

  return (
    <Stack css={css}>
      {isLabelHidden ? (
        <>
          <VisuallyHidden>
            <Form.Label name={name}>{Label}</Form.Label>
          </VisuallyHidden>
          {EnhancedInput}
        </>
      ) : (
        <Form.Label
          name={name}
          css={{
            display: "grid",
            gridArea: "label",
            gridTemplateAreas: `"label" "input"`,
            gap: "$2",

            "&[data-layout='inline-left']": {
              gridTemplateAreas: `"label input"`,
              gridTemplateColumns: "max-content 1fr",
            },

            "&[data-layout='inline-right']": {
              gridTemplateAreas: `"input label"`,
              gridTemplateColumns: "max-content max-content",
            },
          }}
          data-layout={layout}
        >
          <span style={{ gridArea: "label" }}>{Label}</span>
          <span style={{ gridArea: "input" }}>{EnhancedInput}</span>
        </Form.Label>
      )}
      <Form.Error name={name} css={{ gridArea: "error", marginTop: "$2" }} />
    </Stack>
  );
}
