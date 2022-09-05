import * as React from "react";
import * as ContextMenuPrimitives from "@radix-ui/react-context-menu";
import { styled } from "../../stitches";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "../shared";
import { Icon } from "../../Icon/Icon";
import { CheckIcon } from "@radix-ui/react-icons";

const ItemIndicator = () => {
  return (
    <Icon label="Checked" css={{ padding: 0 }}>
      <ContextMenuPrimitives.ItemIndicator asChild>
        <CheckIcon />
      </ContextMenuPrimitives.ItemIndicator>
    </Icon>
  );
};

const StyledCheckboxItem = styled(
  ContextMenuPrimitives.CheckboxItem,
  menuItemStyles
);

const CheckboxItem = ({ children, ...props }: ContextMenuCheckboxItemProps) => {
  return (
    <StyledCheckboxItem {...props}>
      <ItemIndicator />
      {children}
    </StyledCheckboxItem>
  );
};

export type ContextMenuRootProps = ContextMenuPrimitives.ContextMenuProps;
export type ContextMenuTriggerProps =
  ContextMenuPrimitives.ContextMenuTriggerProps;
export type ContextMenuContentProps = React.ComponentProps<
  typeof ContextMenu.Content
>;
export type ContextMenuCheckboxItemProps = React.ComponentProps<
  typeof StyledCheckboxItem
>;

export type ContextMenuLabelProps = React.ComponentProps<
  typeof ContextMenu.Label
>;
export type ContextMenuTriggerItemProps = React.ComponentProps<
  typeof ContextMenu.TriggerItem
>;
export type ContextMenuSeparatorProps = React.ComponentProps<
  typeof ContextMenu.Separator
>;

export const ContextMenu = {
  Root: ContextMenuPrimitives.Root,
  Trigger: ContextMenuPrimitives.Trigger,
  Content: styled(ContextMenuPrimitives.Content, menuContainerStyles),
  Item: styled(ContextMenuPrimitives.Item, menuItemStyles),
  CheckboxItem,
  Label: styled(ContextMenuPrimitives.Label, menuLabelStyles),
  TriggerItem: styled(ContextMenuPrimitives.SubTrigger, menuItemStyles),
  Separator: styled(ContextMenuPrimitives.Separator, menuSeparatorStyles),
};
