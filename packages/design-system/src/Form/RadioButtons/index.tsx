/* eslint-disable react/jsx-props-no-spreading */
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as React from "react";
import { Text } from "../../Text";
import { styled } from "../../stitches";

import { InputGroupProvider, useInputGroup } from "../shared/Context";
import { useInput } from "../useForm";
import { baseInputBoxStyles, baseInputStyles } from "../shared/styles";

const StyledRadio = styled(
  RadioGroup.Item,
  {
    all: "unset",
    borderRadius: "$full",
  },
  baseInputStyles,
  baseInputBoxStyles
);

const Indicator = styled(RadioGroup.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  position: "relative",

  "&::after": {
    content: '""',
    display: "block",
    width: 13,
    height: 13,
    borderRadius: "50%",
    backgroundColor: "white",
  },
});

// eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
type ButtonProps = { value: string } & React.ComponentProps<typeof StyledRadio>;

function Button({ value, ...props }: ButtonProps) {
  const { createId } = useInputGroup("radio");

  return (
    <StyledRadio id={createId(value)} value={value} {...props}>
      <Indicator />
    </StyledRadio>
  );
}

const StyledRadioBox = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

type FieldProps = ButtonProps & { label: string };

function Field({ label, value, disabled, ...props }: FieldProps) {
  const { name, getActive } = useInputGroup("radio");
  const active = getActive(value);

  return (
    <StyledRadioBox
      style={{ marginLeft: "5px" }}
      data-state={active ? "checked" : "unchecked"}
    >
      <Button value={value} disabled={disabled} {...props} />
      <Text
        as="label"
        htmlFor={`${name}-${value}`}
        css={disabled ? { color: "$gray9", opacity: 0.4 } : {}}
      >
        {label}
      </Text>
    </StyledRadioBox>
  );
}

const StyledRadioGroup = styled(RadioGroup.Root, {
  display: "grid",
  gap: "$2",
});

export type RadioGroupProps = {
  name: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  required?: boolean;
  validationMessages?: { required?: string };
};

function Group({
  children,
  name,
  style,
  required = false,
  validationMessages,
}: RadioGroupProps) {
  const { value, blur, setErrors, setValue, submitting } = useInput(
    name,
    "string"
  );

  function getActive(elemValue: string) {
    return value === elemValue;
  }

  function createId(elemValue: string) {
    return `${name}-${elemValue}`;
  }

  const defaultValidationmessages = {
    required: "The field is required and can't be empty",
  };

  const validate = (inputValue: string) => {
    const errors: string[] = [];

    if (required && inputValue.length === 0) {
      errors.push(
        validationMessages?.required ?? defaultValidationmessages.required
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
    <InputGroupProvider
      value={{ name, activeItems: [value], type: "radio", getActive, createId }}
    >
      <StyledRadioGroup
        style={style}
        name={name}
        value={value}
        onValueChange={(newValue) => setValue(newValue)}
      >
        {children}
      </StyledRadioGroup>
    </InputGroupProvider>
  );
}

export const RadioButtons = { Group, Button, Field };
