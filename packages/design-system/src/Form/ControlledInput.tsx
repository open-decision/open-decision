import * as React from "react";
import {
  ControllerRenderProps,
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

type ControlledInputProps = Omit<UseControllerProps, "rules"> & {
  children: (field: ControllerRenderProps) => JSX.Element;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
} & UseControllerProps["rules"];

export function ControlledInput({
  name,
  defaultValue,
  children,
  onChange,
  ...rules
}: ControlledInputProps) {
  const { trigger } = useFormContext();
  const {
    field: { onChange: fieldOnChange, ...field },
  } = useController({ name, defaultValue, rules });

  const mergedOnChange = async <T extends HTMLInputElement>(
    event: React.ChangeEvent<T>
  ) => {
    fieldOnChange(event);
    const isValid = await trigger();

    isValid ? onChange(event) : null;
  };

  return children({ onChange: mergedOnChange, ...field });
}
