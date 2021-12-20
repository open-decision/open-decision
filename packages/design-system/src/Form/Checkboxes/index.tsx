import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { Text } from "../../Text";
import { styled } from "../../stitches";

import { InputGroupProvider, useInputGroup } from "../shared/Context";
import { useInput } from "../useForm";
import { Check } from "react-feather";
import { baseInputBoxStyles, baseInputStyles } from "../shared/styles";

const Indicator = styled(CheckboxPrimitive.Indicator, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledCheckbox = styled(
  CheckboxPrimitive.Root,
  baseInputStyles,
  baseInputBoxStyles,
  {
    all: "unset",
    boxSizing: "border-box",
    borderRadius: "$md",
    padding: "4px",
  }
);

// eslint-disable-next-line react/require-default-props
type CheckboxBoxProps = {
  value: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};

function Box({ value, style, disabled }: CheckboxBoxProps) {
  const { name: groupName, values, createId } = useInputGroup("checkbox");
  const { setValue } = useInput(groupName ?? "", "object");

  if (!(value in values)) {
    throw new Error(
      `The value of ${value} on the checkbox is not a valid value of the group ${groupName} with the values ${Object.keys(
        values
      ).join(" ")}`
    );
  }

  return (
    <StyledCheckbox
      id={createId(value)}
      checked={values[value]}
      onCheckedChange={(newChecked) =>
        setValue({ ...values, [value]: !!newChecked })
      }
      style={style}
      disabled={disabled}
    >
      <Indicator>
        <Check width="100%" height="100%" />
      </Indicator>
    </StyledCheckbox>
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
  const { name: groupName, values, createId } = useInputGroup("checkbox");

  if (!groupName) {
    throw new Error(
      "If the checkbox is not part of a named checkbox group the plain Checkbox component should be used."
    );
  }

  return (
    <StyledCheckboxContainer
      data-state={values[value] ? "checked" : "unchecked"}
    >
      <Box value={value} disabled={disabled} {...props} />
      <Text
        as="label"
        htmlFor={createId(value)}
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
  style?: React.CSSProperties;
  required?: boolean;
};

function createActiveItems(items: Record<string, boolean>) {
  return Object.entries(items)
    .filter((item) => item[1])
    .map((item) => item[0]);
}

function Group({ children, name, style }: CheckboxGroupProps) {
  const { value } = useInput(name, "object");
  const activeItems = createActiveItems(value);

  function getActive(elemName: string) {
    return activeItems.some((item) => item === elemName);
  }

  function createId(elemName: string) {
    return `${name}-${elemName}`;
  }

  return (
    <InputGroupProvider
      value={{
        type: "checkbox",
        name,
        activeItems,
        getActive,
        values: value,
        createId,
      }}
    >
      <StyledCheckboxGroup style={style}>{children}</StyledCheckboxGroup>
    </InputGroupProvider>
  );
}

export const Checkbox = { Group, Field, Box };
