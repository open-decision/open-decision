import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { styled } from "../../stitches";
import { Icon } from "../../Icon/Icon";
import { Check } from "../../icons";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "../shared";

const ItemIndicator = () => {
  return (
    <Icon label="Checked" css={{ padding: 0 }}>
      <DropdownMenuPrimitives.ItemIndicator asChild>
        <Check />
      </DropdownMenuPrimitives.ItemIndicator>
    </Icon>
  );
};

const StyledCheckboxItem = styled(
  DropdownMenuPrimitives.CheckboxItem,
  menuItemStyles
);

const CheckboxItem = ({ children, ...props }: DropdownCheckboxItemProps) => {
  return (
    <StyledCheckboxItem {...props}>
      <ItemIndicator />
      {children}
    </StyledCheckboxItem>
  );
};

export type DropdownMenuRootProps = DropdownMenuPrimitives.DropdownMenuProps;
export type DropdownMenuTriggerProps =
  DropdownMenuPrimitives.DropdownMenuTriggerProps;
export type DropdownMenuContentProps = React.ComponentProps<
  typeof DropdownMenu.Content
>;
export type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenu.Item
>;
export type DropdownCheckboxItemProps = React.ComponentProps<
  typeof StyledCheckboxItem
>;
export type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenu.Label
>;
export type DropdownMenuTriggerItemProps = React.ComponentProps<
  typeof DropdownMenu.TriggerItem
>;
export type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenu.Separator
>;

export const DropdownMenu = {
  Root: DropdownMenuPrimitives.Root,
  Content: styled(DropdownMenuPrimitives.Content, menuContainerStyles),
  Item: styled(DropdownMenuPrimitives.Item, menuItemStyles),
  CheckboxItem,
  Label: styled(DropdownMenuPrimitives.Label, menuLabelStyles),
  Trigger: DropdownMenuPrimitives.Trigger,
  TriggerItem: styled(DropdownMenuPrimitives.TriggerItem, menuItemStyles),
  Separator: styled(DropdownMenuPrimitives.Separator, menuSeparatorStyles),
};
