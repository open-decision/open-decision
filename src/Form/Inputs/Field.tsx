import * as React from "react";
import { Text } from "../../Text";
import { styled } from "../../stitches";

import { ValidationMessage } from "../shared/ValidationMessage";

const FieldBox = styled("div", {
  display: "grid",
  gap: "$2",
});

export type FieldProps = {
  label: string;
  children: React.ReactElement;
  style?: React.CSSProperties;
};

export function Field({ label, children, style }: FieldProps) {
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
    <FieldBox style={style}>
      <Text size="small" css={{ fontWeight: 600 }}>
        {label}
      </Text>
      {children}
      <ValidationMessage name={name} css={{ gridColumn: "1/ -1" }} />
    </FieldBox>
  );
}
