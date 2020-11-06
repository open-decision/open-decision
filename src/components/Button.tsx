import { GlobalProps } from "@internalTypes/global";
import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";

const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-400 text-primary-900",
  secondary: "bg-secondary-500 hover:bg-secondary-400 text-secondary-900",
  tertiary: "bg-tertiary-500 hover:bg-tertiary-400 text-tertiary-900",
  large: "text-xl py-3 px-5  md:text-2xl md:py-6 md:px-8",
  normal: "py-2 px-4",
};

type buttonVariants = typeof buttonVariants;
type buttonTypes = keyof Pick<
  buttonVariants,
  "primary" | "secondary" | "tertiary"
>;
type buttonSizes = keyof Pick<buttonVariants, "large" | "normal">;

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    GlobalProps & { level?: buttonTypes; size?: buttonSizes }
>;

export const Button: Button = ({
  className = "",
  children,
  level = "primary",
  size = "normal",
  ...props
}) => (
  <button
    className={clsx(
      pluck(buttonVariants, [level, size]),
      "shadow font-bold rounded",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
