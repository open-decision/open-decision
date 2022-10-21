import * as React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { Button, ButtonProps } from "@open-decision/design-system";
import { CheckIcon } from "@radix-ui/react-icons";
import { Icon } from "@open-decision/design-system/src/Icon/Icon";

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
      css,
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
        <Button variant={variant} css={css} size="small" ref={ref} {...props}>
          {withCheck ? <Icon>{pressed ? <CheckIcon /> : null}</Icon> : null}
          {children}
        </Button>
      </Toggle.Root>
    );
  }
);
