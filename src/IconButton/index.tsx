import * as React from "react";
import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Button } from "../Button";
import { styled } from "../stitches";
import { Link } from "../Link";
import { alignByContent } from "../stitches/utils";

const iconSizes = {
  small: {
    $$paddingInline: "$space$2",
    paddingBlock: "$$paddingInline",

    "& > svg": {
      width: "18px",
      height: "18px",
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
} as const;

const StyledButton = styled(Button, {
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

const StyledIcon = styled("span", {
  paddingInline: "$$paddingInline",
  transform: "translate($$XTranslation)",

  variants: {
    size: iconSizes,
    alignByContent,
  },

  defaultVariants: {
    size: "medium",
  },
});

type IconProps = {
  children: React.ReactNode;
  label: string;
} & React.ComponentProps<typeof StyledIcon>;
export const Icon = ({ children, label, ...props }: IconProps) => {
  return (
    <StyledIcon className="icon" {...props}>
      <AccessibleIcon.Root label={label}>{children}</AccessibleIcon.Root>
    </StyledIcon>
  );
};
