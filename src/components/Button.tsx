import { Component } from "@internalTypes/global";
import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";

const buttonVariants = {
  base: "clickable shadow font-bold",
  primary: "bg-primary-500 hover:bg-primary-400 text-primary-900",
  secondary: "bg-secondary-500 hover:bg-secondary-400 text-secondary-900",
  tertiary: "bg-red-500 hover:bg-red-400 text-red-100",
  large: "text-xl py-3 px-5  md:text-2xl md:py-6 md:px-8",
  normal: "py-2 px-4",
};

type buttonVariants = typeof buttonVariants;
type buttonLevels = keyof Pick<
  buttonVariants,
  "primary" | "secondary" | "tertiary"
>;

type buttonSizes = keyof Pick<buttonVariants, "large" | "normal">;

type Button = Component<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    level?: buttonLevels;
    size?: buttonSizes;
    rounded?: boolean;
  }
>;

export const Button: Button = ({
  className = "",
  children,
  level = "primary",
  size = "normal",
  rounded = true,
  ...props
}) => (
  <button
    className={clsx(
      pluck(buttonVariants, [level, size, "base"]),
      { rounded: rounded },
      className
    )}
    {...props}
  >
    {children}
  </button>
);
