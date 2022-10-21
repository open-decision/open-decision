import * as React from "react";
import * as Select from "ariakit/select";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "../Menus";
import { styled } from "../stitches";
import { baseInputStyles, baseTextInputStyle } from "../Form/shared/styles";
import "ariakit-utils";

export const Input = styled(
  Select.Select,
  baseInputStyles,
  baseTextInputStyle,
  {
    paddingBlock: "$$paddingBlock",
    paddingInline: "$$paddingInline",
  }
);
export type InputProps = React.ComponentProps<typeof Input>;

export const Popover = styled(Select.SelectPopover, menuContainerStyles);
export type PopoverProps = React.ComponentProps<typeof Popover>;

export const Item = styled(Select.SelectItem, menuItemStyles, {
  justifyContent: "space-between",
});
export type ItemProps = React.ComponentProps<typeof Item>;

export const ItemCheck = styled(Select.SelectItemCheck);
export type ItemCheckProps = React.ComponentProps<typeof ItemCheck>;

export const Arrow = styled(Select.SelectArrow, {});
export type ArrowProps = React.ComponentProps<typeof Arrow>;

export const Group = styled(Select.SelectGroup, {});
export type GroupProps = React.ComponentProps<typeof Group>;

export const GroupLabel = styled(Select.SelectGroupLabel, {});
export type GroupLabelProps = React.ComponentProps<typeof GroupLabel>;

export const Label = styled(Select.SelectLabel, menuLabelStyles);
export type LabelProps = React.ComponentProps<typeof Label>;

export const List = styled(Select.SelectList, {});
export type ListProps = React.ComponentProps<typeof List>;

export const Row = styled(Select.SelectRow, {});
export type RowProps = React.ComponentProps<typeof Row>;

export const Separator = styled(Select.SelectSeparator, menuSeparatorStyles);
export type SeparatorProps = React.ComponentProps<typeof Separator>;

export {
  useSelect,
  useSelectArrow,
  useSelectGroup,
  useSelectGroupLabel,
  useSelectItem,
  useSelectItemCheck,
  useSelectLabel,
  useSelectList,
  useSelectPopover,
  useSelectRow,
  useSelectSeparator,
  useSelectState,
} from "ariakit/select";

export type State = Select.SelectState;
