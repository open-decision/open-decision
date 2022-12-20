import * as React from "react";
import { ClassNameArrayProp, twMerge, WithClassNameArray } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const button = cva(
  [
    "flex justify-center gap-2 cursor-pointer medium-text appearance-none colorScheme-primary rounded-md disabled:cursor-not-allowed items-center focus-visible:inner-focus",
  ],
  {
    variants: {
      size: {
        small: ["px-2", "py-1", "small-text", "font-[500]"],
        medium: ["px-3", "py-2", "medium-text", "font-[500]"],
        large: ["px-4", "py-3", "large-text", "font-[500]", "gap-2"],
      },
      square: { true: ["aspect-square"] },
      round: { true: ["rounded-full"] },
      variant: {
        primary: [
          "bg-colorScheme9",
          "text-white",
          "focus-visible:outer-focus",
          "focus-visible:hover:bg-colorScheme10",
          "active:bg-colorScheme11",
          "disabled:bg-gray6",
          "disabled:text-gray11",
        ],
        secondary: [
          "bg-colorScheme3",
          "text-colorScheme11",
          "focus-visible:hover:bg-colorScheme5",
          "active:bg-colorScheme7",
          "disabled:bg-colorScheme3",
        ],
        tertiary: [
          "bg-transparent",
          "text-colorScheme11",
          "border-current",
          "focus-visible:hover:bg-colorScheme3",
          "active:bg-colorScheme5",
          "disabled:bg-colorScheme1",
        ],
        ghost: ["bg-[unset]"],
        neutral: [
          "colorScheme-gray",
          "bg-[unset]",
          "focus-visible:hover:bg-colorScheme3",
          "active:bg-colorScheme5",
          "disabled:bg-[unset]",
          "disabled:text-colorScheme11",
        ],
      },
      alignByContent: {
        left: "",
        right: "",
      },
    },

    compoundVariants: [
      {
        size: "small",
        square: true,
        className: ["px-2"],
      },
      {
        size: "medium",
        square: true,
        className: ["px-3"],
      },
      {
        size: "large",
        square: true,
        className: ["px-4"],
      },
      {
        alignByContent: "left",
        size: "small",
        className: ["translate-x-[calc((var(--space-2)+1px)*-1)]"],
      },
      {
        alignByContent: "left",
        size: "medium",
        className: ["translate-x-[calc((var(--space-3)+1px)*-1)]"],
      },
      {
        alignByContent: "left",
        size: "large",
        className: ["translate-x-[calc((var(--space-4)+1px)*-1)]"],
      },
      {
        alignByContent: "right",
        size: "small",
        className: ["translate-x-[calc(var(--space-2)+1px)]"],
      },
      {
        alignByContent: "right",
        size: "medium",
        className: ["translate-x-[calc(var(--space-3)+1px)]"],
      },
      {
        alignByContent: "right",
        size: "large",
        className: ["translate-x-[calc(var(--space-4)+1px)]"],
      },
    ],

    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export type ButtonVariants = VariantProps<typeof button>;

export const buttonClasses = (
  variants: ButtonVariants,
  classNames?: ClassNameArrayProp
) => {
  return classNames ? twMerge(button(variants), classNames) : button(variants);
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { classNames, className, children, round, size, square, variant, ...props },
    ref
  ) => {
    return (
      <button
        type="button"
        ref={ref}
        className={buttonClasses({ round, size, square, variant }, [
          classNames,
          className,
        ])}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export type ButtonProps = WithClassNameArray<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> &
  ButtonVariants;
