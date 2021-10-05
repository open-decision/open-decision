import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Button } from "../Button";
import { styled } from "../stitches";
import { Link } from "../Link";

const StyledButton = styled(Button, {
  padding: "$$paddingInline",

  variants: {
    size: {
      small: {
        $$paddingInline: "$space$2",
        paddingBlock: "$$paddingInline",

        "& > svg": {
          width: "22px",
          height: "22px",
        },

        "@laptop": {
          $$paddingInline: "$space$1",
          paddingBlock: "$$paddingInline",

          "& > svg": {
            width: "16px",
            height: "16px",
          },
        },
      },
      medium: {
        $$paddingInline: "$space$2",
        paddingBlock: "$$paddingInline",

        "& > svg": {
          width: "22px",
          height: "22px",
        },
      },
      large: {
        $$paddingInline: "$space$3",
        paddingBlock: "$$paddingInline",

        "& > svg": {
          width: "24px",
          height: "24px",
        },
      },
    },
    round: {
      true: {
        borderRadius: "$full",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type IconButtonProps = {
  label: string;
  Icon: React.ReactNode;
} & React.ComponentProps<typeof StyledButton> &
  (
    | {
        as?: "button";
      }
    | (React.ComponentProps<typeof Link> & {
        as?: "a";
      })
  );

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, children, variant = "primary", Icon, disabled, ...props }, ref) => {
    const EnhancedIcon = React.isValidElement(Icon)
      ? React.cloneElement(Icon, {
          style: { pointerEvents: disabled ? "none" : null },
        })
      : Icon;

    return (
      <StyledButton variant={variant} disabled={disabled} ref={ref} {...props}>
        {children}
        <AccessibleIcon.Root label={label}>{EnhancedIcon}</AccessibleIcon.Root>
      </StyledButton>
    );
  }
);
