import * as React from "react";
import { styled } from "../../stitches";
import { Box } from "../../Box";
import { Input as SystemInput } from "./Input";
import { Button as SystemButton } from "../../Button";

const StyledBox = styled(Box, {
  display: "flex",
  flexWrap: "wrap",
});

export type InputWithButtonProps = React.ComponentProps<typeof Box> & {
  Input: React.ReactElement<React.ComponentProps<typeof SystemInput>>;
  Button: React.ReactElement<React.ComponentProps<typeof SystemButton>>;
  radius?: string;
};

export const InputWithButton = ({
  Input,
  Button,
  radius = "$radii$md",
  ...props
}: InputWithButtonProps) => {
  return (
    <StyledBox {...props}>
      {React.cloneElement(Input, {
        css: {
          ...Input.props?.css,
          flex: "1 1 100%",
          borderRadius: "$none",
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          "@largePhone": {
            flex: "1 1 70%",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: radius,
            borderTopLeftRadius: radius,
          },
        },
      })}
      {React.cloneElement(Button, {
        css: {
          ...Button.props?.css,
          boxShadow: "$none",
          flex: "1 0 100%",
          borderRadius: "$none",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomRightRadius: radius,
          borderBottomLeftRadius: radius,
          maxWidth: "unset",

          "@largePhone": {
            flex: "1 0",
            maxWidth: "max-content",
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
          },
        },
      })}
    </StyledBox>
  );
};
