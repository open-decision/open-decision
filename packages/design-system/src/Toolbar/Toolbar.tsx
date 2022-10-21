import * as React from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { styled } from "../stitches";
import { ToggleButtonProps } from "../Button";
import { linkStyles } from "../Link/Link";
import {
  Button as SystemButton,
  ToggleGroup as SystemToggleGroup,
  ToggleButton as SystemToggleButton,
} from "../Button";
import { Separator as SystemSeparator } from "../Separator";

export const Root = RadixToolbar.Root;
export type RootProps = RadixToolbar.ToolbarProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <RadixToolbar.Button asChild {...props}>
      <SystemButton
        ref={ref}
        css={{ colorScheme: "primary" }}
        variant="neutral"
        square
      >
        {children}
      </SystemButton>
    </RadixToolbar.Button>
  )
);
export type ButtonProps = RadixToolbar.ToolbarButtonProps;

export const Separator = styled(RadixToolbar.Separator, SystemSeparator);
export type SeparatorProps = RadixToolbar.SeparatorProps;

export const Link = styled(RadixToolbar.Link, linkStyles);
export type LinkProps = RadixToolbar.ToolbarLinkProps;

export type ToggleGroupProps = React.ComponentProps<
  typeof RadixToolbar.ToggleGroup
> &
  SystemToggleGroup.RootProps;

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, layout, raised, css, ...props }, ref) => {
    return (
      <RadixToolbar.ToggleGroup ref={ref} asChild {...props}>
        <SystemToggleGroup.Root
          layout={layout}
          raised={raised}
          css={css}
          type={props.type}
        >
          {children}
        </SystemToggleGroup.Root>
      </RadixToolbar.ToggleGroup>
    );
  }
);

export const ToggleItem = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & RadixToolbar.ToggleGroupItemProps
>(function ToggleItem({ children, ...props }, ref) {
  return (
    <RadixToolbar.ToggleItem asChild {...props}>
      <SystemToggleButton
        ref={ref}
        variant="neutral"
        css={{ colorScheme: "primary" }}
        square
        size="medium"
        {...props}
      >
        {children}
      </SystemToggleButton>
    </RadixToolbar.ToggleItem>
  );
});

export type ToggleItemProps = RadixToolbar.ToggleGroupItemProps;

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & RadixToolbar.ToolbarButtonProps
>(function ToggleButton({ children, ...props }, ref) {
  return (
    <RadixToolbar.Button asChild>
      <SystemToggleButton
        ref={ref}
        variant="neutral"
        css={{ colorScheme: "primary" }}
        square
        size="medium"
        {...props}
      >
        {children}
      </SystemToggleButton>
    </RadixToolbar.Button>
  );
});
