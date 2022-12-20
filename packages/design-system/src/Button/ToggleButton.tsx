import * as React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { Button, ButtonProps } from "./Button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Icon } from "../Icon/Icon";

export type ToggleButtonProps = Toggle.ToggleProps &
  ButtonProps & {
    withCheck?: boolean;
  };

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    {
      children,
      pressed,
      defaultPressed,
      onPressedChange,
      withCheck = false,
      variant = "neutral",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Toggle.Root
        asChild
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={onPressedChange}
      >
        <Button
          variant={variant}
          className={className}
          size="small"
          ref={ref}
          {...props}
        >
          {withCheck ? <Icon>{pressed ? <CheckIcon /> : null}</Icon> : null}
          {children}
        </Button>
      </Toggle.Root>
    );
  }
);
