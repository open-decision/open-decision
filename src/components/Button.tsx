import { GlobalProps } from "@internalTypes/global";
import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";

//class="
const buttonVariants = {
  base: "",
  primary:
    "bg-green-300 hover:bg-green-400 text-green-800 shadow hover:shadow-lg",
  secondary:
    "border-2 border-green-400 hover:bg-green-200 text-green-800 shadow hover:shadow-lg",
  tertiary: "text-green-900 hover:text-green-700",
  ghost: "text-gray-600 hover:text-gray-800",

  small: "py-1 px-2 text-sm",
  normal: "py-2 px-4",
  large: "text-xl py-3 px-5 md:text-2xl md:py-6 md:px-8",
} as const;

type buttonVariants = typeof buttonVariants;
type buttonTypes = keyof Pick<
  buttonVariants,
  "primary" | "secondary" | "tertiary" | "base" | "ghost"
>;
type buttonSizes = keyof Pick<buttonVariants, "large" | "normal" | "small">;

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    GlobalProps & {
      level?: buttonTypes;
      size?: buttonSizes;
      rounded?: boolean;
      active?: boolean;
    }
>;

export const Button: Button = ({
  className = "",
  children,
  level = "base",
  size = "normal",
  rounded = true,
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      "font-bold transition-all duration-100",
      pluck(buttonVariants, [level, size]),
      rounded && "rounded",
      active && "border-b-2 border-green-500"
    )}
    {...props}
  >
    {children}
  </button>
);
