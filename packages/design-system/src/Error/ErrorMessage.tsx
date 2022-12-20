import * as React from "react";
import { textClasses, TextVariants } from "../Text/Text";
import { ClassNameValue, twMerge } from "../utils";

const baseClasses =
  "text-danger11 bg-danger2 rounded-md max-w-max empty:hidden px-2 p-1";

export type ErrorMessageVariants = TextVariants;

export const errorMessageClasses = (
  { size }: TextVariants,
  classNames?: ClassNameValue[]
) => twMerge(textClasses({ size }), baseClasses, classNames);

export const ErrorMessage = ({
  className,
  children,
  size,
  ...props
}: ErrorMessageProps) => {
  return (
    <div className={errorMessageClasses({ size }, [className])} {...props}>
      {children}
    </div>
  );
};

export type ErrorMessageProps = React.HTMLAttributes<HTMLDivElement> &
  ErrorMessageVariants;
