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
      "rounded w-full py-2 px-3 focus:bg-tertiary-50 focus:border-tertiary-100 border border-tertiary-100 leading-tight",
      className
    )}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    {...props}
  />
);
