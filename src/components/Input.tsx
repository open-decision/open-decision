import React from "react";
import { Component } from "@internalTypes/global";
import clsx from "clsx";

type Input = React.InputHTMLAttributes<HTMLInputElement> & {
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Input: Component<Input> = ({
  value,
  setValue,
  className,
  ...props
}) => (
  <input
    className={clsx(
      "rounded w-full py-2 px-3 focus:bg-primary-50 leading-tight focus:text-primary-900",
      className
    )}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    {...props}
  />
);
