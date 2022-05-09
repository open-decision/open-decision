import * as React from "react";
import * as Combobox from "ariakit/combobox";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "../Menus";
import { styled } from "../stitches";
import { InputProps as SystemInputProps } from "./Input";
import { Input as SystemInput } from "./Input";

export type InputProps = Combobox.ComboboxProps & SystemInputProps;
export const Input = (props: InputProps) => (
  <Combobox.Combobox as={SystemInput} {...props} />
);

export const Popover = styled(Combobox.ComboboxPopover, menuContainerStyles);
export type PopoverProps = React.ComponentProps<typeof Popover>;

export const Item = styled(Combobox.ComboboxItem, menuItemStyles, {
  justifyContent: "space-between",
});
export type ItemProps = React.ComponentProps<typeof Item>;
export const Cancel = styled(Combobox.ComboboxCancel, {});
export type CancelProps = React.ComponentProps<typeof Cancel>;
export const Disclosure = styled(Combobox.ComboboxDisclosure, {});
export type DisclosureProps = React.ComponentProps<typeof Disclosure>;
export const Group = styled(Combobox.ComboboxGroup, {});
export type GroupProps = React.ComponentProps<typeof Group>;
export const GroupLabel = styled(Combobox.ComboboxGroupLabel, menuLabelStyles);
export type GroupLabelProps = React.ComponentProps<typeof GroupLabel>;

export const ItemValue = styled(Combobox.ComboboxItemValue, {});
export type ItemValueProps = React.ComponentProps<typeof ItemValue>;

export const List = styled(Combobox.ComboboxList, {});
export type ListProps = React.ComponentProps<typeof List>;

export const Row = styled(Combobox.ComboboxRow, {});
export type RowProps = React.ComponentProps<typeof Row>;
export const ComboboxSeparator = styled(
  Combobox.ComboboxSeparator,
  menuSeparatorStyles
);

export type SeparatorProps = React.ComponentProps<typeof Row>;

export {
  useCombobox,
  useComboboxItem,
  useComboboxGroupLabel,
  useComboboxPopover,
  useComboboxGroup,
  useComboboxItemValue,
  useComboboxCancel,
  useComboboxDisclosure,
  useComboboxRow,
  useComboboxList,
  useComboboxSeparator,
  useComboboxState,
} from "ariakit/combobox";

export type State = Combobox.ComboboxState;
export type ComboboxOptions = Combobox.ComboboxOptions;
export type RowOptions = Combobox.ComboboxRowOptions;
export type ItemOptions = Combobox.ComboboxItemOptions;
export type ListOptions = Combobox.ComboboxListOptions;
export type GroupOptions = Combobox.ComboboxGroupOptions;
export type CancelOptions = Combobox.ComboboxCancelOptions;
export type PopoverOptions = Combobox.ComboboxPopoverOptions;
export type ItemValueOptions = Combobox.ComboboxItemValueOptions;
export type SeparatorOptions = Combobox.ComboboxSeparatorOptions;
export type DisclosureOptions = Combobox.ComboboxDisclosureOptions;
export type GroupLabelOptions = Combobox.ComboboxGroupLabelOptions;
