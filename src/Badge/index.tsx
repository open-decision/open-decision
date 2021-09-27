import * as React from "react";
import { merge } from "remeda";
import { styled } from "../stitches";

export const StyledBadge = styled("span", {
  borderRadius: "$md",
  fontWeight: "$semibold",
  fontSize: "$sm",
  paddingBlock: "$1",

  variants: {
    size: {
      default: {
        paddingInline: "$3",
      },
      large: {
        paddingInline: "$4",
      },
    },
  },

  defaultVariants: {
    size: "default",
  },
});

export type BadgeProps = React.ComponentProps<typeof StyledBadge>;

export const Badge = React.forwardRef<HTMLButtonElement, BadgeProps>(
  ({ css, ...props }, ref) => (
    <StyledBadge
      ref={ref}
      css={merge(
        { color: `$primary9`, backgroundColor: `$primary3` },
        css ?? {}
      )}
      {...props}
    />
  )
);
