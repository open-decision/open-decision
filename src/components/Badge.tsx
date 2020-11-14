import React from "react";
import { Component } from "@internalTypes/global";
import clsx from "clsx";
import { pluck } from "@utils/index";

//class="
const tagColors = {
  red: "text-red-900 bg-red-200",
  blue: "text-blue-900 bg-blue-200",
  green: "text-green-900 bg-green-200",
  yellow: "text-yellow-900 bg-yellow-200",
  indigo: "text-indigo-900 bg-indigo-200",
  orange: "text-orange-900 bg-orange-200",
  teal: "text-teal-900 bg-teal-200",
  purple: "text-purple-900 bg-purple-200",
  pink: "text-pink-900 bg-pink-200",
};

export type tagColors = keyof typeof tagColors;

type Badge = { color: tagColors };

export const Badge: Component<
  React.HTMLAttributes<HTMLSpanElement> & Badge
> = ({ children, className = "", color, ...props }) => {
  return (
    <span
      className={clsx(
        className,
        "px-3 rounded-md font-semibold text-sm",
        pluck(tagColors, [color])
      )}
      {...props}
    >
      {children}
    </span>
  );
};
