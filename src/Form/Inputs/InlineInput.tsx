/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled } from "../../stitches";
import { Box } from "../../Box";
import { useInput } from "../useForm";
import { InputProps } from "./Input";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";

const StyledBox = styled(Box, {
  ...baseInputStyles,
  border: 0,
  $$borderWidth: "2px",
  borderBottom: "$$borderWidth solid $colors$gray8",
  display: "flex",
  alignItems: "center",

  "&:focus-within": {
    boxShadow: "none",
    borderColor: "$colors$primary10",
  },
});

const StyledInput = styled("input", {
  ...baseTextInputStyle,
  textStyle: "medium-text",
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$2",
  paddingInline: "$$paddingInline",
  paddingBlock: "$$paddingBlock",
  backgroundColor: "transparent",
  outline: "none",
  //FIXME Stitches has an open issue in regards to the order in which classNames are applied -> https://github.com/modulz/stitches/issues/671
  // Since Input is not directly a styled component the order of the styles is not controlled correctly.
  borderColor: "transparent !important",
  boxShadow: "none !important",
  flex: 1,

  "&:focus-visible": {
    boxShadow: "none",
    outline: "none",
  },
});

export type InlineInputProps =
  | (InputProps & { borderless?: boolean })
  | (InputProps & { borderless: true; Icon: JSX.Element });

export const InlineInput = React.forwardRef<HTMLInputElement, InlineInputProps>(
  (
    {
      name,
      minLength,
      maxLength,
      regex,
      required,
      onChange,
      onBlur,
      value,
      disabled,
      alignByContent = "center",
      borderless,
      Buttons,
      Icon,
      ...props
    },
    forwardedRef
  ) => {
    const {
      value: formValue,
      blur,
      setBlur,
      setValue,
      setErrors,
      submitting,
    } = useInput(name, "string");

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

    return (
      <StyledBox
        css={{
          color: disabled ? "$gray8" : "$gray11",
          $$borderWidth: borderless ? "0px" : undefined,
        }}
        data-disabled={disabled}
      >
        {Icon}
        <StyledInput
          disabled={disabled}
          name={name}
          ref={forwardedRef}
          value={value ?? formValue}
          onChange={(event) => {
            onChange ? onChange?.(event) : setValue(event.target.value ?? "");
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setBlur(true);
          }}
          alignByContent={alignByContent}
          minLength={minLength}
          maxLength={maxLength}
          pattern={regex}
          required={required}
          {...props}
        />
        {Buttons}
      </StyledBox>
    );
  }
);
