/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled, VariantProps } from "../../stitches";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { useInput } from "../useForm";
import { Box } from "../../Box";
import { useComposedRefs } from "../../internal/utils";

const StyledBox = styled(
  Box,
  {
    ...baseInputStyles,
    borderRadius: "$md",
    display: "flex",
    alignItems: "center",
    focusStyle: "inner",
    overflow: "hidden",
    padding: "1px",
    $$paddingInline: "$space$2",
    $$paddingBlock: "$space$3",
    paddingInline: "$$paddingInline",
  },
  baseTextInputStyle
);

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

export type InputProps = Omit<
  React.ComponentProps<typeof StyledInput>,
  "value" | "size"
> & {
  name: string;
  value?: string;
  regex?: string;
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: React.ReactNode;
} & VariantProps<typeof StyledBox>;

const InputComponent = (
  {
    name,
    minLength,
    maxLength,
    regex,
    required,
    onChange,
    onBlur,
    Buttons,
    disabled,
    css,
    size,
    Icon,
    ...props
  }: InputProps,
  forwardedRef: React.Ref<HTMLInputElement>
) => {
  const innerRef = useComposedRefs(forwardedRef);
  const [hasFocus, setHasFocus] = React.useState(false);

  React.useEffect(() => {
    if (
      document.hasFocus() &&
      innerRef.current?.contains(document.activeElement)
    ) {
      setHasFocus(true);
    }
  }, []);

  const { value, blur, setBlur, setValue, setErrors, submitting } = useInput(
    name,
    "string"
  );

  const defaultValidationmessages = {
    required: "The field is required and can't be empty",
    minLength: `Please enter at least ${minLength} chars.`,
    regex: `The input doesn't fulfill the requirements.`,
    maxLength: `You've reached the maximum allowed characters (${maxLength}).`,
  };

  const validate = (inputValue: string) => {
    const errors: string[] = [];

    if (required && inputValue.length === 0) {
      errors.push(defaultValidationmessages.required);
    }

    if (minLength && inputValue.length < minLength) {
      errors.push(defaultValidationmessages.minLength);
    }

    if (regex && !new RegExp(regex).test(inputValue)) {
      errors.push(defaultValidationmessages.regex);
    }

    if (maxLength && inputValue.length === maxLength) {
      errors.push(defaultValidationmessages.maxLength);
    }

    return errors;
  };

  React.useEffect(() => {
    if (blur || submitting) {
      setErrors(validate(value ?? ""));
    }
  }, [value, blur, submitting]);

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
        name={name}
        ref={innerRef}
        value={value}
        onChange={(event) => {
          onChange ? onChange?.(event) : setValue(event.target.value ?? "");
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setBlur(true);
          setHasFocus(false);
        }}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        pattern={regex}
        required={required}
        onFocus={() => setHasFocus(true)}
        {...props}
      />
      {Buttons}
    </StyledBox>
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  InputComponent
);
