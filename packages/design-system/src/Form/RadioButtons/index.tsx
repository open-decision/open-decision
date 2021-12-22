/* eslint-disable react/jsx-props-no-spreading */
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as React from "react";
import { Text } from "../../Text";
import { styled, StyleObject } from "../../stitches";

import { InputGroupProvider, useInputGroup } from "../shared/Context";
import { baseInputBoxStyles, baseInputStyles } from "../shared/styles";
import {
  Controller,
  RegisterOptions,
  useFormContext,
  useWatch,
} from "react-hook-form";

const StyledRadio = styled(
  RadioGroup.Item,
  { all: "unset", borderRadius: "$full" },
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

type ButtonProps = { disabled?: boolean; value: string; id?: string };

function Button({ disabled, value, id }: ButtonProps) {
  return (
    <StyledRadio id={id} value={value} disabled={disabled}>
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

function Field({ label, disabled, value, ...props }: FieldProps) {
  const { name, getActive, createId } = useInputGroup("radio");
  const inputValue = useWatch({ name });
  const isActive = getActive?.(inputValue);
  const id = createId(value);

  return (
    <StyledRadioBox
      style={{ marginLeft: "5px" }}
      data-state={isActive ? "checked" : "unchecked"}
    >
      <Button id={id} disabled={disabled} value={value} {...props} />
      <Text
        htmlFor={id}
        as="label"
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
  css?: StyleObject;
  children: React.ReactNode;
  required?: boolean;
  validationMessages?: { required?: string };
} & RegisterOptions;

function Group({ children, name, css }: RadioGroupProps) {
  const inputValue = useWatch({ name });
  const { control } = useFormContext();

  function getActive(elemValue: string) {
    return inputValue === elemValue;
  }

  function createId(value: string) {
    return `${name}-${value}`;
  }

  return (
    <InputGroupProvider value={{ name, type: "radio", getActive, createId }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onBlur, onChange, ref } }) => {
          return (
            <StyledRadioGroup
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              ref={ref}
              css={css}
              name={name}
            >
              {children}
            </StyledRadioGroup>
          );
        }}
      />
    </InputGroupProvider>
  );
}

export const RadioButtons = { Group, Button, Field };
