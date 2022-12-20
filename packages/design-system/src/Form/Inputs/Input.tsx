import * as React from "react";
import {
  baseInputClasses,
  textInputClasses,
  BaseInputVariants,
  TextInputVariants,
} from "../shared/shared";
import { twMerge, WithClassNameArray } from "../../utils";

export type InputProps = {
  Buttons?: JSX.Element | JSX.Element[];
  Icon?: ({ className }: { className: string }) => React.ReactNode;
  disabled?: boolean;
} & WithClassNameArray<React.InputHTMLAttributes<HTMLInputElement>> &
  BaseInputVariants &
  TextInputVariants;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      disabled,
      size,
      Icon,
      className,
      classNames,
      variant,
      name,
      id,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={twMerge(
          baseInputClasses({ variant }),
          textInputClasses({ size }),
          classNames,
          className
        )}
        data-disabled={disabled}
      >
        {Icon?.({ className: "text-gray11 absolute z-10 pl-3" })}
        <input
          className="px-3 py-2 w-full min-w-0 outline-none bg-transparent border-none"
          ref={ref}
          disabled={disabled}
          style={{
            paddingLeft: Icon ? "calc(var(--space-3) * 2 + 1em)" : undefined,
          }}
          name={name}
          id={id ?? name}
          {...props}
        />
      </div>
    );
  }
);
