import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";

const variants = {
  primary:
    "bg-green-300 hover:bg-green-400 text-green-800 shadow hover:shadow-lg",
  secondary:
    "border-2 border-green-400 hover:bg-green-200 text-green-800 shadow hover:shadow-lg",
  tertiary: "text-green-900 hover:text-green-700",
  ghost: "text-gray-600 hover:text-gray-800",
  icon:
    "rounded-full w-10 h-10 overflow-hidden flex justify-center items-center clickable",
} as const;

const sizes = {
  small: "py-1 px-2 text-sm",
  normal: "py-2 px-4",
  large: "text-xl py-3 px-5 md:text-2xl md:py-6 md:px-8",
  filled: "p-0",
} as const;

type buttonTypes = keyof typeof variants;
type buttonSizes = keyof typeof sizes;

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    level?: buttonTypes;
    size?: buttonSizes;
    rounded?: boolean;
    active?: boolean;
  }
>;

export const Button: Button = ({
  className = "",
  children,
  level = "primary",
  size = "normal",
  rounded = true,
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      "font-bold transition-all duration-100",
      pluck([size], sizes),
      pluck([level], variants),
      rounded && "rounded",
      active && "border-b-2 border-green-500"
    )}
    {...props}
  >
    {children}
  </button>
);
