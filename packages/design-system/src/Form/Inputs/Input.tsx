/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../../stitches";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { Box } from "../../Box";
import { UseInputProps, useInput } from "./useInput";
import { useFormContext } from "react-hook-form";

const StyledBox = styled(Box, baseInputStyles, baseTextInputStyle, {
  borderRadius: "$md",
  display: "flex",
  alignItems: "center",
  focusStyle: "inner",
  overflow: "hidden",
  padding: "1px",
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$3",
  paddingInline: "$$paddingInline",
});

const StyledInput = styled("input", {
  borderRadius: "$md",
  paddingBlock: "$$paddingBlock",
  border: "none",
  width: "100%",
  minWidth: 0,
  transform: "translateX($$XTranslation)",
  outline: "none",
  backgroundColor: "transparent",
  textStyle: "inherit",

  "&:focus-visible": {
    outline: "none",
  },
});

interface BaseInputProps {
  name: string;
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: React.ReactNode;
  css?: StyleObject;
  size?: React.ComponentProps<typeof StyledBox>["size"];
  alignByContent?: React.ComponentProps<typeof StyledBox>["alignByContent"];
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export type InputProps = BaseInputProps & UseInputProps;

const InputComponent = (
  {
    disabled,
    Buttons,
    size,
    css,
    name,
    Icon,
    alignByContent,
    autoFocus = false,
    placeholder,
    ...props
  }: InputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) => {
  const {
    ref,
    hasFocus,
    inputProps: { onBlur, ...inputProps },
    setHasFocus,
  } = useInput(name, props, forwardedRef);

  const EnhancedIcon = React.isValidElement(Icon)
    ? React.cloneElement(Icon, {
        "data-active": hasFocus,
      })
    : Icon;

  return (
    <StyledBox
      css={{ color: disabled ? "$gray8" : undefined, ...css }}
      data-disabled={disabled}
      data-focus={hasFocus}
      size={size}
      alignByContent={alignByContent}
    >
      {EnhancedIcon}
      <StyledInput
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setHasFocus(true)}
        onBlur={(event) => {
          onBlur?.(event);
          setHasFocus(false);
        }}
        ref={ref}
        {...inputProps}
      />
      {Buttons}
    </StyledBox>
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  InputComponent
);
