/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, StyleObject } from "../../stitches";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { Box } from "../../Box";
import { useComposedRefs } from "../../internal/utils";
import { RegisterOptions, useFormContext } from "react-hook-form";

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

export type InputProps = {
  name: string;
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: React.ReactNode;
  css?: StyleObject;
  size?: React.ComponentProps<typeof StyledBox>["size"];
} & RegisterOptions;

const InputComponent = (
  { name, Buttons, disabled, css, size, Icon, ...props }: InputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) => {
  const { register } = useFormContext();
  const { ref, ...inputProps } = register(name, { disabled, ...props });
  const innerRef = useComposedRefs(forwardedRef);

  const [hasFocus, setHasFocus] = React.useState(false);

  React.useEffect(() => {
    if (
      document.hasFocus() &&
      innerRef.current?.contains(document.activeElement)
    ) {
      setHasFocus(true);
    }
  }, [innerRef]);

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
    >
      {EnhancedIcon}
      <StyledInput
        {...inputProps}
        onFocus={() => setHasFocus(true)}
        ref={(e) => {
          ref(e);
          // @ts-expect-error - by default forwardedRef.current is readonly. Let's ignore it
          innerRef.current = e;
        }}
      />
      {Buttons}
    </StyledBox>
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  InputComponent
);
