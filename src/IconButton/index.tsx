import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Button } from "../Button";
import { styled } from "../stitches";

const StyledButton = styled(Button, {
  display: "flex",
  gap: "$1",
  padding: "$$paddingInline",
  width: "max-content",

  variants: {
    size: {
      sm: {
        $$paddingInline: "$space$1",
        paddingBlock: "$$paddingInline",

        "& > svg": {
          width: "16px",
          height: "16px",
        },
      },
      md: {
        $$paddingInline: "$space$2",
        paddingBlock: "$$paddingInline",

        "& > svg": {
          width: "20px",
          height: "20px",
        },
      },
      lg: {
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
    size: "md",
  },
});

export type IconButtonProps = React.ComponentProps<typeof StyledButton> & {
  label: string;
  Icon: React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, children, variant = "primary", Icon, ...props }, ref) => {
    return (
      <StyledButton variant={variant} ref={ref} {...props}>
        {children}
        <AccessibleIcon.Root label={label}>{Icon}</AccessibleIcon.Root>
      </StyledButton>
    );
  }
);
