import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { ClassNameValue, twMerge, WithClassNameArray } from "../utils";

const stack = cva(["flex flex-start flex-col"], {
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },

  defaultVariants: {
    center: false,
  },
});

export type StackVariants = VariantProps<typeof stack>;

export const stackClasses = (
  variants?: StackVariants,
  classNames?: ClassNameValue[] | ClassNameValue
) => (classNames ? twMerge(stack(variants), classNames) : stack(variants));

export type StackProps = StackVariants &
  WithClassNameArray<React.HTMLAttributes<HTMLDivElement>>;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, classNames, center, ...props }, ref) => {
    return (
      <div
        className={stackClasses({ center }, [classNames, className])}
        {...props}
        ref={ref}
      />
    );
  }
);
