import * as React from "react";
import { styled } from "../stitches";

export const StyledBadge = styled("span", {
  colorScheme: "primary",
  textStyle: "badge",
  borderRadius: "$full",
  border: "1px solid transparent",
  textAlign: "center",
  maxWidth: "max-content",

  variants: {
    level: {
      primary: { backgroundColor: "$colorScheme9", color: "$colorScheme1" },
      secondary: { color: "$colorScheme11", borderColor: "currentcolor" },
    },
    size: {
      small: {
        paddingBlock: "$1",
        paddingInline: "$2",
      },
      medium: {
        paddingBlock: "$2",
        paddingInline: "$4",
      },
      large: {
        paddingBlock: "$2",
        paddingInline: "$6",
        fontSize: "$button",
      },
    },
  },

  defaultVariants: {
    level: "primary",
    size: "medium",
  },
});

export type BadgeProps = React.ComponentProps<typeof StyledBadge>;

export const Badge = React.forwardRef<HTMLButtonElement, BadgeProps>(
  ({ ...props }, ref) => <StyledBadge ref={ref} {...props} />
);
