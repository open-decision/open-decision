import React from "react";
import clsx from "clsx";

type Input = React.InputHTMLAttributes<HTMLInputElement> & {
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Input: React.FunctionComponent<Input> = ({
  value,
  setValue,
  className,
  ...props
}) => (
  <input
    className={clsx(
      "rounded w-full py-2 px-3 leading-tight  bg-gray-100 border-2 border-gray-300 shadow-inner",
      className
    )}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    {...props}
  />
);
