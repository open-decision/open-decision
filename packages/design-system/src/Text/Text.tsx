import * as React from "react";
import { ClassNameValue, twMerge } from "../utils";

export const textSizeClasses = {
  inherit: "textStyle-inherit",
  "extra-small": "extra-small-text",
  small: "small-text",
  medium: "medium-text",
  large: "large-text",
};

export type TextSizeVariants = keyof typeof textSizeClasses;

export type TextVariants = { size?: TextSizeVariants };

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> &
  TextVariants;

export const textClasses = (
  { size = "inherit" }: TextVariants = {},
  classNames?: ClassNameValue[] | ClassNameValue
) =>
  classNames
    ? twMerge(textSizeClasses[size], classNames)
    : textSizeClasses[size];

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, children, size, ...props }, ref) => {
    return (
      <p ref={ref} className={textClasses({ size }, [className])} {...props}>
        {children}
      </p>
    );
  }
);
