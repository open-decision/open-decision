import * as React from "react";
import { styled, StyleObject, VariantProps } from "@open-decision/design-system/src/stitches";
import { baseInputStyles, baseTextInputStyle } from "@open-decision/design-system/src/Form/shared/styles";
import { Box } from "@open-decision/design-system/src/Box";
import { alignByContent } from "@open-decision/design-system/src/shared/variants";
import { FormInput } from "ariakit/form";

const StyledBox = styled(
  Box,
  alignByContent,
  baseInputStyles,
  baseTextInputStyle,
  { overflow: "hidden" }
);

const StyledInput = styled(FormInput, {
  paddingBlock: "$$paddingBlock",
  paddingInline: "$$paddingInline",
  border: "none",
  width: "100%",
  minWidth: 0,
  outline: "none",
  backgroundColor: "transparent",
  textStyle: "inherit",
  colorFallback: "$colorScheme-text",
});

export type InputProps = {
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: (props: { css: StyleObject }) => JSX.Element;
  disabled?: boolean;
} & VariantProps<typeof StyledBox> &
  Omit<React.ComponentProps<typeof StyledInput>, "size">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { disabled, size, css, Icon, alignByContent, className, variant, ...props },
    ref
  ) {
    return (
      <StyledBox
        css={{ $color: disabled ? "$gray8" : css?.color, ...css }}
        className={className}
        data-disabled={disabled}
        size={size}
        variant={variant}
        alignByContent={alignByContent}
      >
        {Icon?.({
          css: {
            color: "$gray11",
            position: "absolute",
            zIndex: "$10",
            marginLeft: "$$paddingInline",
          },
        })}
        <StyledInput
          ref={ref}
          disabled={disabled}
          css={{
            paddingLeft: Icon ? "calc($$paddingInline * 2 + 1em)" : undefined,
          }}
          {...props}
        />
      </StyledBox>
    );
  }
);
