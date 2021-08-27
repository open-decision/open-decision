import * as React from "react";
import { Box } from "../../Box";
import { Button as SystemButton } from "../../Button";
import { Input as SystemInput } from "../index";
import { merge } from "remeda";
import { styled } from "../../stitches";

const StyledBox = styled(Box, {
  display: "flex",
  flexWrap: "wrap",
});

export type InputWithButtonProps = React.ComponentProps<typeof Box> & {
  Input: React.ReactElement<React.ComponentProps<typeof SystemInput>>;
  Button: React.ReactElement<React.ComponentProps<typeof SystemButton>>;
};

export const InputWithButton = ({
  Input,
  Button,
  ...props
}: InputWithButtonProps) => {
  return (
    <StyledBox {...props}>
      {React.cloneElement(Input, {
        css: merge(
          {
            flex: "1 1 100%",
            borderTopLeftRadius: "var(--radius)",
            borderTopRightRadius: "var(--radius)",

            "@largePhone": {
              flex: "1 1 70%",
              borderTopRightRadius: 0,
              borderBottomLeftRadius: "var(--radius)",
            },
          },
          Input.props?.css ?? {}
        ),
      })}
      {React.cloneElement(Button, {
        css: merge(
          {
            boxShadow: "$none",
            flex: "1 0 100%",
            borderBottomRightRadius: "var(--radius)",
            borderBottomLeftRadius: "var(--radius)",

            "@largePhone": {
              flex: "1 0",
              maxWidth: "max-content",
              borderBottomLeftRadius: 0,
              borderTopRightRadius: "var(--radius)",
            },
          },
          Button.props?.css ?? {}
        ),
        rounded: "none",
      })}
    </StyledBox>
  );
};
