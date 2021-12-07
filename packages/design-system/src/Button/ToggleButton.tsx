import * as React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";
import { styled } from "../stitches";
import { Button, ButtonProps } from "..";

export type ToggleButtonProps = Toggle.ToggleProps & ButtonProps;

export const ToggleButton = ({
  children,
  pressed,
  defaultPressed,
  onPressedChange,
  ...props
}: ToggleButtonProps) => {
  return (
    <Toggle.Root
      asChild
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
    >
      <Button variant="ghost" square size="small" {...props}>
        {children}
      </Button>
    </Toggle.Root>
  );
};

const Root = styled(ToggleGroupPrimitives.Root, {
  display: "inline-flex",
  borderRadius: "$md",
  boxShadow: "$1",
  backgroundColor: "transparent",
});

const Item = styled(ToggleGroupPrimitives.Item, {
  borderRadius: 0,
  boxShadow: "none !important",
  marginLeft: 1,

  "&:first-child": {
    margin: 0,
    borderTopLeftRadius: "$md",
    borderBottomLeftRadius: "$md",
  },
  "&:last-child": {
    borderTopRightRadius: "$md",
    borderBottomRightRadius: "$md",
  },
});
type ToggleItemProps = ToggleGroupPrimitives.ToggleGroupItemProps;

const ToggleItem = ({ children, ...props }: ToggleItemProps) => {
  return (
    <Item asChild {...props}>
      {children}
    </Item>
  );
};

export const ToggleGroup = {
  Root,
  Item: ToggleItem,
};
