import * as React from "react";
import {
  baseInputClasses,
  BaseInputVariants,
  inputWrapperClasses,
} from "../shared/shared";
import { twMerge } from "../../utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseInputVariants;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant, id, name, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={twMerge(
          baseInputClasses({ variant }),
          inputWrapperClasses,
          "rounded-md p-[2px] accent-primary9",
          className
        )}
        id={id ?? name}
        name={name}
        {...props}
      />
    );
  }
);
