import * as React from "react";
import { textClasses, TextVariants } from "../Text/Text";
import { ClassNameValue } from "../utils";

export const linkClasses = (
  { size = "inherit" }: TextVariants = {},
  className?: ClassNameValue[] | ClassNameValue
) =>
  textClasses({ size }, [
    `inline-flex items-center no-underline text-primary11 rounded-sm intent:underline focus-visible:inner-focus`,
    className,
  ]);

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  TextVariants;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, size, ...props }, ref) => {
    return (
      <a className={linkClasses({ size }, [className])} ref={ref} {...props}>
        {children}
      </a>
    );
  }
);
