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
  focusType: "inner-within",
  overflow: "hidden",
  colorScheme: "primary",
});

const StyledInput = styled("input", {
  paddingBlock: "$$paddingBlock",
  paddingInline: "$$paddingInline",
  border: "none",
  width: "100%",
  minWidth: 0,
  transform: "translateX($$XTranslation)",
  outline: "none",
  backgroundColor: "transparent",
  textStyle: "inherit",
  colorFallback: "$colorScheme-text",
});

export type InputProps = {
  name: string;
  Buttons?: JSX.Element | JSX.Element[];

  Icon?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
} & React.ComponentProps<typeof StyledBox> &
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
      ...props
    },
    ref
  ) {
    const [inputFocusRef, hasFocus, setHasFocus] = useInputFocus();

    const EnhancedIcon = React.isValidElement(Icon)
      ? React.cloneElement(Icon, {
          "data-active": hasFocus,
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
