import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Button } from "../Button";
import { styled } from "../stitches";
import { VariantProps } from "../stitches";

const StyledButton = styled(Button, {
  display: "flex",
  gap: "$2",

  $$paddingInline: "$space$2",
  padding: "$$paddingInline",

  variants: {
    size: {
      sm: {
        $$paddingInline: "$space$1",
        fontSize: "$sm",
      },
      lg: {
        $$paddingInline: "$space$3",
      },
      xl: {
        $$paddingInline: "$space$5",

        "& > svg": {
          width: "20px",
          height: "20px",
        },
      },
    },
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
