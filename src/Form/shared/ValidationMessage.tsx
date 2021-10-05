import * as React from "react";
import { styled, StyleObject } from "../../stitches";

import { useInput } from "../useForm";

const StyledErrorList = styled("ul", {
  listStyle: "none",
  padding: "0",
  display: "flex",
  flexWrap: "wrap",
  gap: "$2",
  margin: "0",
});

const StyledMessage = styled("li", {
  color: "$error11",
  border: "1px solid $colors$error5",
  backgroundColor: "$error1",
  padding: "$1 $2",
  borderRadius: "$md",
  fontSize: "$sm",
  width: "max-content",
});

export type ValidationMessageProps = {
  name: string;
  css: StyleObject;
  className?: string;
};

export function ValidationMessage({
  name,
  css,
  className,
}: ValidationMessageProps) {
  const { errors } = useInput(name);

  if (!errors.length) {
    return <></>;
  }

  return (
    <StyledErrorList css={css} className={className}>
      {errors.map((message: string) =>
        message.length ? (
          <StyledMessage key={message}>{message}</StyledMessage>
        ) : (
          <></>
        )
      )}
    </StyledErrorList>
  );
}
