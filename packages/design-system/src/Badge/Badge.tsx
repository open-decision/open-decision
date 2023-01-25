import * as React from "react";
import { ClassNameValue, twMerge } from "../utils/twMerge";

const sizeStyles = {
  small: "px-2 extra-small-text",
  medium: "py-1 px-3 small-text",
  large: "py-1 px-4 medium-text",
};

export type BadgeSizeVariants = keyof typeof sizeStyles;

export type BadgeVariants = { size?: BadgeSizeVariants };

export const badgeClasses = (
  { size }: BadgeVariants,
  classNames?: ClassNameValue[]
) =>
  twMerge(
    "rounded-md text-center colorScheme-primary bg-colorScheme2 text-colorScheme11 flex items-center justify-center gap-1 break-keep",
    size && sizeStyles[size],
    ...(classNames ? classNames : [])
  );

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, size = "medium", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={badgeClasses({ size }, [className])}
        {...props}
      >
        {children}
      </span>
    );
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: BadgeSizeVariants;
};
