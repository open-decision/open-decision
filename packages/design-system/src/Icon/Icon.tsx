import * as React from "react";
import { styled, css } from "../stitches";
import { alignByContent } from "../shared/variants";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { iconSizes } from "./shared";

export const iconStyles = css(alignByContent, iconSizes, {
  transform: "translate($$XTranslation)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  "&[data-active='true'] > svg": {
    stroke: "$colorScheme10",
  },

  defaultVariants: {
    size: "medium",
  },
});

const StyledIcon = styled("span", iconStyles);

export type IconProps = {
  children: React.ReactNode;
  label?: string;
} & React.ComponentProps<typeof StyledIcon>;

const IconImpl = (
  { children, label, ...props }: IconProps,
  ref: React.Ref<HTMLSpanElement>
) => {
  return (
    <AccessibleIcon.Root label={label ?? ""}>
      <StyledIcon className="icon" ref={ref} {...props}>
        {children}
      </StyledIcon>
    </AccessibleIcon.Root>
  );
};

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(IconImpl);
