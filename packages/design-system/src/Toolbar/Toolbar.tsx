import * as React from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { styled } from "../stitches";
import { Button as SystemButton } from "../Button";
import { hoverSelector } from "../stitches/stateSelectors";
import { Separator as SystemSeparator } from "../Separator";
import { linkStyles } from "../Link/Link";
import * as SystemToggleGroup from "../Button/ToggleGroup";

const buttonProps = {
  size: "medium",
  variant: "neutral",
  square: true,
  css: {
    [`${hoverSelector}`]: {
      backgroundColor: "$gray4",
    },
  },
} as const;

export const Root = RadixToolbar.Root;
export type RootProps = RadixToolbar.ToolbarProps;

export const Button = styled(RadixToolbar.Button, SystemButton);
Button.defaultProps = buttonProps;
export type ButtonProps = RadixToolbar.ToolbarButtonProps;

export const Separator = styled(RadixToolbar.Separator, SystemSeparator);
export type SeparatorProps = RadixToolbar.SeparatorProps;

export const Link = styled(RadixToolbar.Link, linkStyles);
export type LinkProps = RadixToolbar.ToolbarLinkProps;

export const ToggleGroup = styled(
  RadixToolbar.ToggleGroup,
  SystemToggleGroup.Root
);
ToggleGroup.defaultProps = { variant: "lowered" };

export type ToggleGroupProps = RadixToolbar.ToggleGroupProps;

export const ToggleItem = styled(
  RadixToolbar.ToggleItem,
  SystemToggleGroup.Item
);

export type ToggleItemProps = RadixToolbar.ToggleGroupItemProps;
export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  SystemToggleGroup.ToggleButtonProps & ToggleItemProps
>(function ToggleButton({ children, ...props }, ref) {
  return (
    <ToggleItem asChild>
      <SystemButton ref={ref} {...buttonProps} {...props}>
        {children}
      </SystemButton>
    </ToggleItem>
  );
});
