import { ErrorMessage as FormErrorMessage } from "@hookform/error-message";
import * as React from "react";
import { useFormContext } from "react-hook-form";
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
  name: string;
  css?: StyleObject;
  className?: string;
};

export function ValidationMessage({ name, css }: ValidationMessageProps) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <FormErrorMessage
      name={name}
      errors={errors}
      render={({ message }) => (
        <ErrorList css={css}>
          <ErrorMessage size="extra-small" key={message}>
            {message}
          </ErrorMessage>
        </ErrorList>
      )}
    />
  );
}
