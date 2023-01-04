import * as React from "react";
import * as ComboboxPrimitive from "ariakit/combobox";
import { InputProps as SystemInputProps } from "../Inputs/Input";
import { Input as SystemInput } from "../Inputs/Input";
import { twMerge } from "../../utils";
import {
  menuContainerClasses,
  menuItemClasses,
  menuLabelClasses,
} from "../../Menus";
import { separatorClasses } from "../../Separator/Separator";

// ------------------------------------------------------------------
export type InputProps = Omit<ComboboxPrimitive.ComboboxProps, "className"> &
  Omit<SystemInputProps, "name" | "state">;

export const Input = (props: InputProps) => (
  <ComboboxPrimitive.Combobox as={SystemInput} {...props} />
);

// ------------------------------------------------------------------
// Popover
export type PopoverProps = ComboboxPrimitive.ComboboxPopoverProps;

export const Popover = ({ className, ...props }: PopoverProps) => {
  return (
    <ComboboxPrimitive.ComboboxPopover
      className={twMerge(menuContainerClasses, className)}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Item
export type ItemProps = ComboboxPrimitive.ComboboxItemProps;

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <ComboboxPrimitive.ComboboxItem
        className={twMerge(menuItemClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

// ------------------------------------------------------------------
// Cancel
export type CancelProps = ComboboxPrimitive.ComboboxCancelOptions;

export const Cancel = ComboboxPrimitive.ComboboxCancel;

// ------------------------------------------------------------------
// Disclosure
export type DisclosureProps = ComboboxPrimitive.ComboboxDisclosureProps;

export const Disclosure = ComboboxPrimitive.ComboboxDisclosure;

// ------------------------------------------------------------------
// Group
export type GroupProps = ComboboxPrimitive.ComboboxGroupProps;

export const Group = ComboboxPrimitive.ComboboxGroup;

// ------------------------------------------------------------------
// GroupLabel

export type GroupLabelProps = ComboboxPrimitive.ComboboxGroupLabelProps;

export const GroupLabel = ({ className, ...props }: GroupLabelProps) => {
  return (
    <ComboboxPrimitive.ComboboxGroupLabel
      className={twMerge(menuLabelClasses, className)}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// ItemValue
export type ItemValueProps = ComboboxPrimitive.ComboboxItemValueProps;

export const ItemValue = ComboboxPrimitive.ComboboxItemValue;

// ------------------------------------------------------------------
// List
export type ListProps = ComboboxPrimitive.ComboboxListProps;

export const List = ComboboxPrimitive.ComboboxList;

// ------------------------------------------------------------------
// Row

export type RowProps = ComboboxPrimitive.ComboboxRowProps;

export const Row = ComboboxPrimitive.ComboboxRow;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = ComboboxPrimitive.ComboboxSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <ComboboxPrimitive.ComboboxSeparator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
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
