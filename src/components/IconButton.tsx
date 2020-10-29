import React from "react";

type IconButton = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: string;
    alt: string;
    className?: string;
  }
>;

export const IconButton: IconButton = ({
  icon,
  alt,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`block rounded-full w-10 h-10 overflow-hidden border-4 sm:w-12 sm:h-12 border-gray-100 ${className}`}
      {...props}
    >
      <img src={icon} alt={alt} className="h-full w-full object-cover" />
    </button>
  );
};
