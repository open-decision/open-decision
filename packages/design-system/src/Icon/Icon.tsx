import * as React from "react";
import { styled, css } from "../stitches";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";

export const iconStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1em",
  height: "1em",

  "& svg": {
    width: "1em",
    height: "1em",
  },

  "&[data-active='true'] > svg": {
    stroke: "$colorScheme11",
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
    // FIXME Disable typecheck for now until @radix-ui/react-accessible-icon gets react 18 types
    // @ts-expect-error - not yet using React 18 types
    <AccessibleIcon.Root label={label ?? ""}>
      <StyledIcon className="icon" ref={ref} {...props}>
        {children}
      </StyledIcon>
    </AccessibleIcon.Root>
  );
};

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(IconImpl);
