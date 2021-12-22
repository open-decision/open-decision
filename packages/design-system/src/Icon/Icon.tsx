import * as React from "react";
import { styled } from "../stitches";
import { alignByContent } from "../stitches/utils";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { iconSizes } from "./shared";

const StyledIcon = styled("span", alignByContent, iconSizes, {
  $$iconSize: "0px",
  transform: "translate($$XTranslation)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&[data-active='true'] > svg": {
    stroke: "$primary10",
  },

  defaultVariants: {
    size: "medium",
  },
});

export type IconProps = {
  children: React.ReactNode;
  label?: string;
} & React.ComponentProps<typeof StyledIcon>;
export const Icon = ({ children, label, ...props }: IconProps) => {
  return (
    <AccessibleIcon.Root label={label ?? ""}>
      <StyledIcon className="icon" {...props}>
        {children}
      </StyledIcon>
    </AccessibleIcon.Root>
  );
};
