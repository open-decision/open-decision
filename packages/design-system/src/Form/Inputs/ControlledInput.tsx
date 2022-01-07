import * as React from "react";
import { ChangeEvent } from "react";
import {
  ControllerRenderProps,
  useController,
  UseControllerProps,
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
  const {
    field: { onChange: fieldOnChange, ...field },
    fieldState: { invalid },
  } = useController({ name, defaultValue, rules });

  const mergedOnChange = <T extends HTMLInputElement>(
    event: ChangeEvent<T>
  ) => {
    fieldOnChange(event);
    !invalid ? onChange(event) : null;
  };

  return children({ onChange: mergedOnChange, ...field });
}
