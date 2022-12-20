import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { ClassNameValue, twMerge } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const baseClasses = cva("inline-flex items-center justify-center", {
  variants: {
    size: {
      inherit: "[&>svg]:h-[1em] [&>svg]:w-[1em]",
      "extra-small": "[&>svg]:w-[12px] [&>svg]:h-[12px]",
      small: "[&>svg]:w-[16px] [&>svg]:h-[16px]",
      medium: "[&>svg]:w-[20px] [&>svg]:h-[20px]",
      large: "[&>svg]:w-[22px] [&>svg]:h-[22px]",
    },
  },

  defaultVariants: {
    size: "small",
  },
});

export type IconVariants = VariantProps<typeof baseClasses>;

export const iconClasses = (
  variants: IconVariants,
  classNames?: ClassNameValue[]
) =>
  classNames
    ? twMerge(baseClasses(variants), classNames)
    : baseClasses(variants);

export type IconProps = {
  children: React.ReactNode;
  label?: string;
} & React.HTMLAttributes<HTMLSpanElement> &
  IconVariants;

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    { children, label, className, size, ...props }: IconProps,
    ref: React.Ref<HTMLSpanElement>
  ) => {
    return (
      <AccessibleIcon.Root label={label ?? ""}>
        <span
          ref={ref}
          className={iconClasses({ size }, [className])}
          {...props}
        >
          {children}
        </span>
      </AccessibleIcon.Root>
    );
  }
);
