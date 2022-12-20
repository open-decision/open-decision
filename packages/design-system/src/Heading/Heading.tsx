import * as React from "react";
import { ClassNameValue, twMerge } from "../utils";

const headingSizeClasses = {
  "extra-small": "extra-small-heading",
  small: "small-heading",
  medium: "medium-heading",
  large: "large-heading",
  "extra-large": "extra-large-heading",
};

export type HeadingSizeVariants = keyof typeof headingSizeClasses;

export type HeadingVariants = { size?: HeadingSizeVariants };

export const headingClasses = (
  { size = "medium" }: HeadingVariants,
  classNames?: ClassNameValue[] | ClassNameValue
) =>
  classNames
    ? twMerge(headingSizeClasses[size], classNames)
    : headingSizeClasses[size];

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  HeadingVariants & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" };

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, as = "h2", size, ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={headingClasses({ size }, [className])}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
