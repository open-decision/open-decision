import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ClassNameValue, twMerge } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const baseClasses = cva(["bg-gray5 my-1 rounded-full"], {
  variants: {
    orientation: {
      vertical: "w-[1px] h-[95%]",
      horizontal: "w-[95%] h-[1px]",
    },
  },
});

export type SeparatorVariants = VariantProps<typeof baseClasses>;

export const separatorClasses = (
  variants?: SeparatorVariants,
  classNames?: ClassNameValue[] | ClassNameValue
) =>
  classNames
    ? twMerge(baseClasses(variants), classNames)
    : baseClasses(variants);

export type SeparatorProps = SeparatorPrimitive.SeparatorProps &
  SeparatorVariants;

export const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <SeparatorPrimitive.Root
      className={separatorClasses({ orientation }, [className])}
      {...props}
    />
  );
};
