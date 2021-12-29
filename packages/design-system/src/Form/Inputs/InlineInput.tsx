import * as React from "react";
import { styled } from "../../stitches";
import { Box } from "../../Box";
import { InputProps } from "./Input";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { useMeasure } from "react-use";
import { useFormContext, useWatch } from "react-hook-form";
import { useInput } from "./useInput";
import { useEditing } from "./useEditing";

const StyledBox = styled(Box, baseInputStyles, {
  border: 0,
  display: "flex",
  alignItems: "center",

  "&:focus-within": {
    boxShadow: "none",
  },
});

const StyledInput = styled("input", baseTextInputStyle, {
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$2",
  $$width: "0px",
  paddingInline: "$$paddingInline",
  paddingBlock: "$$paddingBlock",
  backgroundColor: "transparent",
  outline: "none",
  //FIXME Stitches has an open issue in regards to the order in which classNames are applied -> https://github.com/modulz/stitches/issues/671
  // Since Input is not directly a styled component the order of the styles is not controlled correctly.
  borderColor: "transparent !important",
  boxShadow: "none !important",
  boxSizing: "content-box",
  textStyle: "inherit",

  "&:focus-visible": {
    boxShadow: "none",
    outline: "none",
  },
});

const SizingSpan = styled("span", {
  paddingInline: "$2",
  textStyle: "medium-text",
  whiteSpace: "pre-wrap",
});

export type InlineInputProps = InputProps & { IndicatorButton?: JSX.Element };

const InlineInputImpl = (
  {
    name,
    alignByContent,
    disabled = false,
    Buttons,
    IndicatorButton,
    css,
    size,
    ...props
  }: InlineInputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) => {
  const { setValue } = useFormContext();
  const inputValue = useWatch({ name });

  const { ref, inputProps, hasFocus } = useInput(name, props, forwardedRef);

  const [wrapperRef, { width }] = useMeasure<HTMLSpanElement>();
  const { isEditing, startEditing } = useEditing(
    ref,
    disabled,
    (originalValue) => setValue(name, originalValue)
  );

  const EnhancedIndicatorButton = IndicatorButton
    ? React.cloneElement(IndicatorButton, {
        "data-active": isEditing,
        onClick: startEditing,
        type: "button",
        disabled,
      })
    : IndicatorButton;

  return (
    <StyledBox
      css={{ color: disabled ? "$gray8" : "$gray12" }}
      data-disabled={disabled}
      data-focus={hasFocus}
    >
      <StyledInput
        {...inputProps}
        size={size}
        ref={ref}
        alignByContent={alignByContent}
        css={{
          minWidth: "50px",
          width: `${width}px`,
          ...css,
        }}
      />
      <SizingSpan
        ref={wrapperRef}
        style={{
          position: "absolute",
          left: "-9999px",
          display: "inline-block",
        }}
      >
        {inputValue}
      </SizingSpan>
      {EnhancedIndicatorButton}
      {Buttons}
    </StyledBox>
  );
};

export const InlineInput = React.forwardRef(InlineInputImpl);
