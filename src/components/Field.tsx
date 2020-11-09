import { Component } from "@internalTypes/global";
import clsx from "clsx";
import React from "react";
import { Input } from "./Input";

type Input = React.InputHTMLAttributes<HTMLInputElement> & {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  label: string;
  layout: "block" | "inline";
};

export const Field: Component<Input> = ({
  className,
  name,
  label,
  value,
  setValue,
  layout = "block",
  ...props
}) => {
  return (
    <div
      className={clsx(
        {
          "flex items-center space-x-6": layout === "inline",
          "space-y-2": layout === "block",
        },
        className
      )}
    >
      <label htmlFor={name} className={clsx("text-gray-900 font-bold")}>
        {label}
      </label>
      <Input value={value} setValue={setValue} {...props} />
    </div>
  );
};
