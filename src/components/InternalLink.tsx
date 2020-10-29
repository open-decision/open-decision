import React, { FunctionComponent } from "react";
import { Link, LinkProps } from "react-router-dom";

export const InternalLink: FunctionComponent<LinkProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Link className={`no-underline text-base ${className}`} {...props}>
      {children}
    </Link>
  );
};
