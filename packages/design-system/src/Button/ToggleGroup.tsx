import * as React from "react";
import { activeStyle } from "../shared/utils";
import { styled, darkTheme } from "../stitches";
import { Button as SystemButton, ButtonProps } from "./Button";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";

export const Root = styled(ToggleGroupPrimitives.Root, {
  display: "inline-flex",
  borderRadius: "$md",
  boxShadow: "$1",
  layer: "3",
  padding: "$1",
  gap: "$1",

  [`.${darkTheme} &`]: {
    layer: "4",
  },
});

export type ToggleItemProps = ToggleGroupPrimitives.ToggleGroupItemProps;
export type ToggleRootProps = React.ComponentProps<typeof Root>;
export type ToggleButtonProps = ButtonProps;

export const Item = ({ children, ...props }: ToggleItemProps) => {
  return (
    <ToggleGroupPrimitives.Item {...props}>
      {children}
    </ToggleGroupPrimitives.Item>
  );
};

const ButtonImpl = (
  { children, css, ...props }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) => (
  <SystemButton
    ref={ref}
    variant="neutral"
    pressable={false}
    size="small"
    css={{
      fontSize: "$medium-text",
      color: "$gray11",
      colorScheme: "primary",
      focusType: "outer",

      ...activeStyle({
        color: "$white",
        backgroundColor: "$colorScheme9",
      }),
      ...css,
    }}
    {...props}
  >
    {children}
  </SystemButton>
);

export const Button = React.forwardRef(ButtonImpl);
