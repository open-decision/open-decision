import { GlobalProps } from "@internalTypes/global";
import React from "react";

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & GlobalProps
>;

export const Button: Button = ({ className = "", children, ...props }) => (
  <button
    className={`shadow bg-mint-500 hover:bg-mint-400 text-mint-900  focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${className}`}
    {...props}
  >
    {children}
  </button>
);
