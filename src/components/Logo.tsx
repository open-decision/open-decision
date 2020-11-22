import React from "react";
import { InternalLink } from "./InternalLink";

export const Logo: React.FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  return (
    <InternalLink to="/">
      <h1
        className={`text-gray-800 font-bold text-xl md:text-3xl ${className}`}
      >
        open <span className="text-red-500">decision</span>
      </h1>
    </InternalLink>
  );
};
