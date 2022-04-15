import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { Text } from "../../Text";
import { styled, StyleObject } from "../../stitches";

import { InputGroupProvider, useInputGroup } from "../shared/Context";
import { baseInputBoxStyles, baseInputStyles } from "../shared/styles";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CheckIcon } from "@radix-ui/react-icons";

const Indicator = styled(CheckboxPrimitive.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledCheckbox = styled(
  CheckboxPrimitive.Root,
  { all: "unset" },
  baseInputStyles,
  baseInputBoxStyles,
  {
    boxSizing: "border-box",
    borderRadius: "$md",
    padding: "4px",
  }
);

type CheckboxBoxProps = {
  value: string;
  disabled?: boolean;
  css?: StyleObject;
  id?: string;
};

function Box({ value, css, disabled, id }: CheckboxBoxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={value}
      control={control}
      render={({ field: { onBlur, onChange, value, ref } }) => (
        <StyledCheckbox
          id={id}
          checked={value}
          onCheckedChange={onChange}
          onBlur={onBlur}
          css={css}
          disabled={disabled}
          ref={ref}
        >
          <Indicator>
            <CheckIcon width="100%" height="100%" />
          </Indicator>
        </StyledCheckbox>
      )}
    />
  );
}

const StyledCheckboxContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

export type CheckboxFieldProps = {
  label: string;
} & CheckboxBoxProps;

function Field({ value, label, disabled, ...props }: CheckboxFieldProps) {
  const { name: groupName, createId } = useInputGroup("checkbox");
  const inputValue = useWatch({ name: value });
  const id = createId(value);
  const isActive = inputValue;

  if (!groupName) {
    throw new Error(
      "If the checkbox is not part of a named checkbox group the plain Checkbox component should be used."
    );
  }

  return (
    <StyledCheckboxContainer data-state={isActive ? "checked" : "unchecked"}>
      <Box id={id} value={value} disabled={disabled} {...props} />
      <Text
        as="label"
        htmlFor={id}
        css={disabled ? { color: "$gray9", opacity: 0.4 } : {}}
      >
        {label}
      </Text>
    </StyledCheckboxContainer>
  );
}

const StyledCheckboxGroup = styled("div", {
  display: "grid",
  gap: "$2",
});

export type CheckboxGroupProps = {
  name: string;
  children: React.ReactNode;
  css?: StyleObject;
  required?: boolean;
};

function Group({ children, name, css }: CheckboxGroupProps) {
  function createId(value: string) {
    return `${name}-${value}`;
  }

  return (
    <InputGroupProvider value={{ type: "checkbox", name, createId }}>
      <StyledCheckboxGroup css={css}>{children}</StyledCheckboxGroup>
    </InputGroupProvider>
  );
}

export const Checkbox = { Group, Field, Box };
