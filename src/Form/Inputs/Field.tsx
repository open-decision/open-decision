/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { Text } from "../../Text";
import { styled, StyleObject } from "../../stitches";

import { ValidationMessage } from "../shared/ValidationMessage";

type Layouts = "column" | "row" | "responsive";
function getResponsiveFieldStyles(layout: Layouts): StyleObject {
  switch (layout) {
    case "responsive":
      return {
        "@largePhone": {
          alignItems: "center",
          gridTemplateColumns: "max-content 1fr",
          gap: "$1 $2",
        },
      };

    case "column":
      return {
        gridTemplateColumns: "1fr",
      };

    case "row":
      return { gridTemplateColumns: "max-content 1fr", alignItems: "center" };

    default:
      return {};
  }
}

const FieldBox = styled("div", {
  display: "grid",
  gap: "$2",
});

export type FieldProps = {
  label: string;
  children: React.ReactElement;
  // layout?: Layouts;
  style?: React.CSSProperties;
};

export function Field({
  label,
  children,
  // layout = "column",
  style,
}: FieldProps) {
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
    <FieldBox
      // css={getResponsiveFieldStyles(layout)}
      style={style}
    >
      <Text size="small" css={{ fontWeight: 600 }}>
        {label}
      </Text>
      {children}
      <ValidationMessage name={name} css={{ gridColumn: "1/ -1" }} />
    </FieldBox>
  );
}
