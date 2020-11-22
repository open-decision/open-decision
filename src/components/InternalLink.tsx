import { pluck } from "@utils/index";
import clsx from "clsx";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

const variants = {
  default: "",
  icon:
    "rounded-full w-10 h-10 overflow-hidden flex justify-center items-center clickable",
} as const;

type linkVariants = keyof typeof variants;

type InternalLink = React.FC<
  LinkProps & { variant?: linkVariants; className: string }
>;

export const InternalLink: InternalLink = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  return (
    <Link
      className={clsx(
        pluck([variant], variants),
        className,
        "no-underline text-base"
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
