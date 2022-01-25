/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled } from "../../stitches";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { Box } from "../../Box";
import { useInputFocus } from "./useInputFocus";

const StyledBox = styled(Box, baseTextInputStyle, baseInputStyles, {
  borderRadius: "$md",
  display: "flex",
  alignItems: "center",
  focusStyle: "inner",
  overflow: "hidden",
  padding: "1px",
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$3",
  paddingInline: "$$paddingInline",
  gap: "$3",
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

export type InputProps = {
  name: string;
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
} & React.ComponentProps<typeof StyledBox> &
  React.ComponentProps<typeof StyledInput>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      disabled,
      Buttons,
      size,
      css,
      Icon,
      alignByContent,
      onBlur,
      onFocus,
      className,
      ...props
    },
    ref
  ) {
    const [inputFocusRef, hasFocus, setHasFocus] = useInputFocus();

    const EnhancedIcon = React.isValidElement(Icon)
      ? React.cloneElement(Icon, {
          "data-active": hasFocus,
        })
      : Icon;

    return (
      <StyledBox
        css={{ color: disabled ? "$gray8" : undefined, ...css }}
        className={className}
        data-disabled={disabled}
        data-focus={hasFocus}
        size={size}
        alignByContent={alignByContent}
      >
        {EnhancedIcon}
        <StyledInput
          onFocus={(event) => {
            onFocus?.(event);
            setHasFocus(true);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setHasFocus(false);
          }}
          ref={(e) => {
            typeof ref === "function" ? ref?.(e) : null;
            inputFocusRef.current = e;
          }}
          disabled={disabled}
          {...props}
        />
        {Buttons}
      </StyledBox>
    );
  }
);
