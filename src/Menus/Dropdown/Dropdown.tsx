import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { styled } from "../../stitches";
import { Icon } from "../../Button/IconButton";
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

type CheckboxItemProps = React.ComponentProps<typeof StyledCheckboxItem>;
const CheckboxItem = ({ children, ...props }: CheckboxItemProps) => {
  return (
    <StyledCheckboxItem {...props}>
      <ItemIndicator />
      {children}
    </StyledCheckboxItem>
  );
};

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
