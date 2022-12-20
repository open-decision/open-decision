import * as React from "react";
import { textClasses, TextVariants } from "../Text/Text";
import { ClassNameValue, twMerge } from "../utils";

export const labelClasses = (
  { size = "inherit" }: TextVariants,
  classNames?: ClassNameValue[] | ClassNameValue
) =>
  twMerge(
    textClasses({ size }),
    "inline-flex items-center gap-2 font-[500] disabled:text-gray11",
    classNames
  );

export type LabelVariants = TextVariants;

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  LabelVariants;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, size, ...props }, ref) => {
    return (
      <label
        className={labelClasses({ size }, [className])}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  }
);
