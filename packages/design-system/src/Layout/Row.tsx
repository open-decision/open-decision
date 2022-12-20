import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { ClassNameValue, twMerge, WithClassNameArray } from "../utils";

const row = cva(["flex flex-start"], {
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },

  defaultVariants: {
    center: false,
  },
});

export type RowVariants = VariantProps<typeof row>;

export const rowClasses = (
  variants?: RowVariants,
  classNames?: ClassNameValue[] | ClassNameValue
) => (classNames ? twMerge(row(variants), classNames) : row(variants));

export type RowProps = RowVariants &
  WithClassNameArray<React.HTMLAttributes<HTMLDivElement>>;

export const Row = ({ className, classNames, center, ...props }: RowProps) => {
  return (
    <div
      className={rowClasses({ center }, [classNames, className])}
      {...props}
    />
  );
};
