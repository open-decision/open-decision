import * as React from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { ToggleButtonProps } from "../Button";
import {
  Button as SystemButton,
  ButtonProps as SystemButtonProps,
  ToggleGroup as SystemToggleGroup,
  ToggleButton as SystemToggleButton,
} from "../Button";
import { separatorClasses } from "../Separator/Separator";

// ------------------------------------------------------------------
// Root
export type RootProps = RadixToolbar.ToolbarProps;
export const Root = RadixToolbar.Root;

// ------------------------------------------------------------------
// Button
export type ButtonProps = RadixToolbar.ToolbarButtonProps & SystemButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <RadixToolbar.Button asChild>
      <SystemButton
        ref={ref}
        className="colorScheme-primary"
        variant="neutral"
        square
        {...props}
      >
        {children}
      </SystemButton>
    </RadixToolbar.Button>
  )
);

// ------------------------------------------------------------------
// Separator
export type SeparatorProps = RadixToolbar.SeparatorProps;
export const Separator = ({
  className,
  orientation,
  ...props
}: SeparatorProps) => {
  return (
    <RadixToolbar.Separator
      className={separatorClasses({ orientation }, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// ToggleGroup

export type ToggleGroupProps = React.ComponentProps<
  typeof RadixToolbar.ToggleGroup
> &
  SystemToggleGroup.RootProps;

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, layout, raised, className, ...props }, ref) => {
    return (
      <RadixToolbar.ToggleGroup ref={ref} asChild {...props}>
        <SystemToggleGroup.Root
          layout={layout}
          raised={raised}
          className={className}
          {...props}
        >
          {children}
        </SystemToggleGroup.Root>
      </RadixToolbar.ToggleGroup>
    );
  }
);

// ------------------------------------------------------------------
// ToggleItem

export const ToggleItem = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & RadixToolbar.ToggleGroupItemProps
>(function ToggleItem({ children, ...props }, ref) {
  return (
    <RadixToolbar.ToggleItem asChild {...props}>
      <SystemToggleGroup.Item ref={ref} {...props}>
        {children}
      </SystemToggleGroup.Item>
    </RadixToolbar.ToggleItem>
  );
});

// ------------------------------------------------------------------
// ToggleButton

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
        className="colorScheme-primary"
        square
        size="medium"
        {...props}
      >
        {children}
      </SystemToggleButton>
    </RadixToolbar.Button>
  );
});
