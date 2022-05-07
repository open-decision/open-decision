import * as React from "react";
import { styled, StyleObject } from "../stitches";
import { textStyles } from "../Text";

export const ErrorList = styled("ul", {
  listStyle: "none",
  padding: "0",
  display: "flex",
  flexWrap: "wrap",
  gap: "$2",
  margin: "0",
});

export const ErrorMessage = styled("li", textStyles, {
  color: "$danger11",
  border: "1px solid $colors$danger5",
  backgroundColor: "$danger1",
  padding: "$1 $2",
  borderRadius: "$md",
  fontSize: "$sm",
  listStyle: "none",
});

export type ValidationMessageProps = {
  css?: StyleObject;
  className?: string;
  errors?: string[];
};

export function ValidationMessage({
  errors,
  css,
  className,
}: ValidationMessageProps) {
  return errors ? (
    <ErrorList css={css} className={className}>
      {errors.map((error) => (
        <ErrorMessage size="extra-small" key={error}>
          {error}
        </ErrorMessage>
      ))}
    </ErrorList>
  ) : null;
}
