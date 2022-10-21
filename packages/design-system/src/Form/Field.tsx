import * as React from "react";
import { StyleObject } from "../stitches";

import { Form } from "../Form";
import { VisuallyHidden } from "ariakit";
import { Stack } from "../Layout";
import { Box } from "../Box";

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

  const EnhancedInput = React.cloneElement(children, {
    css: { ...children.props?.css, gridArea: "input" },
  });

  const isLabelHidden = layout === "no-label";

  return (
    <Stack css={{ textStyle: "medium-text", ...css }}>
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
            textStyle: "inherit",

            "&[data-layout='inline-left']": {
              gridTemplateAreas: `"label input"`,
              gridTemplateColumns: "max(max-content, 100%) 1fr",
            },

            "&[data-layout='inline-right']": {
              gridTemplateAreas: `"input label"`,
              gridTemplateColumns:
                "max(max-content, 100%) max(max-content, 100%)",
            },
          }}
          data-layout={layout}
        >
          <Box
            as="span"
            css={{
              gridArea: "label",
              ...(typeof Label === "string"
                ? {
                    wordBreak: "break-word",
                  }
                : {}),
            }}
          >
            {Label}
          </Box>
          <Box as="span" css={{ gridArea: "input" }}>
            {EnhancedInput}
          </Box>
        </Form.Label>
      )}
      <Form.Error
        data-test={`error-${name}`}
        name={name}
        css={{ gridArea: "error", marginTop: "$2" }}
      />
    </Stack>
  );
}
