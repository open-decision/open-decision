/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, VariantProps } from "../stitches";
import { baseInputStyles, baseTextInputStyle } from "./shared/styles";
import { Box } from "../Box";
import { alignByContent } from "../shared/variants";
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
  Icon?: React.ReactNode;
  disabled?: boolean;
} & VariantProps<typeof StyledBox> &
  Omit<React.ComponentProps<typeof StyledInput>, "size">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      disabled,
      size,
      css,
      Icon,
      alignByContent,
      onBlur,
      onFocus,
      className,
      variant,
      ...props
    },
    ref
  ) {
    const EnhancedIcon = React.isValidElement(Icon)
      ? React.cloneElement(Icon, {
          // "data-active": hasFocus,
          css: {
            color: "$gray11",
            position: "absolute",
            zIndex: "$10",
            marginLeft: "$$paddingInline",
            ...Icon.props.css,
          },
        })
      : Icon;

    return (
      <StyledBox
        css={{ $color: disabled ? "$gray8" : css?.color, ...css }}
        className={className}
        data-disabled={disabled}
        size={size}
        variant={variant}
        alignByContent={alignByContent}
      >
        {EnhancedIcon}
        <StyledInput
          ref={ref}
          disabled={disabled}
          css={{
            paddingLeft: EnhancedIcon
              ? "calc($$paddingInline * 2 + 1em)"
              : undefined,
          }}
          {...props}
        />
        {/* <Button
          size="small"
          variant="ghost"
          type="button"
          disabled={!inputValue}
          square
          css={{
            focusType: "inner",
            opacity: inputValue ? 1 : "0 !important",
          }}
          onClick={() => {
            clearErrors(name);
            return reset();
          }}
        >
          <Icon label="Entferne die momentan ausgewählte Option">
            <X />
          </Icon>
        </Button> */}
      </StyledBox>
    );
  }
);
