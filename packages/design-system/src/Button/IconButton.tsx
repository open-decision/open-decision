import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Button, buttonStyles } from "../Button/Button";
import { styled, css } from "../stitches";
import { iconSizes } from "../Icon/shared";

export const iconButtonStyles = css(
  {
    padding: "$$paddingInline",

    variants: {
      size: iconSizes,
      round: {
        true: {
          borderRadius: "$full",
        },
      },
    },

    defaultVariants: {
      size: "medium",
    },
  },
  buttonStyles
);

const StyledButton = styled(Button, iconButtonStyles);

export type IconButtonProps = React.ComponentProps<typeof StyledButton> & {
  label: string;
  Icon: React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, children, variant = "primary", Icon, disabled, ...props },
    ref
  ) {
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
