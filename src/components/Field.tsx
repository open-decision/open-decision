import React from "react";
import { Input } from "./Input";

type Input = React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    setValue: React.Dispatch<React.SetStateAction<string>>;
    name: string;
    label: string;
  }
>;

export const Field: Input = ({
  className,
  name,
  label,
  value,
  setValue,
  ...props
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <Input value={value} setValue={setValue} {...props} />
    </div>
  );
};
