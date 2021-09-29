/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled } from "../../stitches";
import { baseInputStyles } from "../shared/styles";

import { useInput } from "../useForm";

const StyledInput = styled("input", {
  ...baseInputStyles,
  backgroundColor: "$gray1",
  borderRadius: "$md",
  padding: "$1",
});

export type InputProps = Omit<
  React.ComponentProps<typeof StyledInput>,
  "name"
> & {
  name: string;
  validationMessages?: {
    required?: string;
    minLength?: string;
    regex?: string;
    maxLength?: string;
  };
  regex?: string;
};

export function Input({
  name,
  minLength,
  maxLength,
  regex,
  required,
  validationMessages,
  ...props
}: InputProps) {
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
      errors.push(
        validationMessages?.required ?? defaultValidationmessages.required
      );
    }

    if (minLength && inputValue.length < minLength) {
      errors.push(
        validationMessages?.minLength ?? defaultValidationmessages.minLength
      );
    }

    if (regex && !new RegExp(regex).test(inputValue)) {
      errors.push(validationMessages?.regex ?? defaultValidationmessages.regex);
    }

    if (maxLength && inputValue.length === maxLength) {
      errors.push(
        validationMessages?.maxLength ?? defaultValidationmessages.maxLength
      );
    }

    return errors;
  };

  React.useEffect(() => {
    if (blur || submitting) {
      setErrors(validate(value ?? ""));
    }
  }, [value, blur, submitting]);

  return (
    <StyledInput
      value={value}
      onChange={(event) => setValue(event.target.value ?? "")}
      onBlur={() => setBlur(true)}
      {...props}
    />
  );
}
