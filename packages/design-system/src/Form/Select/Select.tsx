import * as React from "react";
import * as SelectPrimitive from "ariakit/select";
import "ariakit-utils";
import {
  baseInputClasses,
  BaseInputVariants,
  textInputClasses,
  TextInputVariants,
} from "../shared/shared";
import { twMerge } from "../../utils";
import {
  menuContainerClasses,
  menuItemClasses,
  menuLabelClasses,
} from "../../Menus";
import { separatorClasses } from "../../Separator/Separator";

// ------------------------------------------------------------------
// Item

export type InputProps = SelectPrimitive.SelectProps &
  BaseInputVariants &
  TextInputVariants;

export const Input = React.forwardRef<HTMLButtonElement, InputProps>(
  ({ className, variant, size = "medium", ...props }, ref) => {
    return (
      <SelectPrimitive.Select
        className={twMerge(
          baseInputClasses({ variant }),
          textInputClasses({ size }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// ------------------------------------------------------------------
// Popover

export type PopoverProps = SelectPrimitive.SelectPopoverProps;

export const Popover = ({ className, ...props }: PopoverProps) => {
  return (
    <SelectPrimitive.SelectPopover
      className={
        className
          ? twMerge(menuContainerClasses, className)
          : menuContainerClasses
      }
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Item

export type ItemProps = SelectPrimitive.SelectItemProps;

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <SelectPrimitive.SelectItem
        className={
          className ? twMerge(menuItemClasses, className) : menuItemClasses
        }
        ref={ref}
        {...props}
      />
    );
  }
);

// ------------------------------------------------------------------
// ItemCheck

export type ItemCheckProps = SelectPrimitive.SelectItemCheckProps;

export const ItemCheck = SelectPrimitive.SelectItemCheck;

// ------------------------------------------------------------------
// Arrow

export type ArrowProps = SelectPrimitive.SelectArrowProps;

export const Arrow = SelectPrimitive.SelectArrow;

// ------------------------------------------------------------------
// Group

export type GroupProps = SelectPrimitive.SelectGroupProps;

export const Group = SelectPrimitive.SelectGroup;

// ------------------------------------------------------------------
// GroupLabel

export type GroupLabelProps = SelectPrimitive.SelectGroupLabelProps;

export const GroupLabel = SelectPrimitive.SelectGroupLabel;

// ------------------------------------------------------------------
// Label

export type LabelProps = SelectPrimitive.SelectLabelProps;

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <SelectPrimitive.SelectLabel
      className={
        className ? twMerge(menuLabelClasses, className) : menuLabelClasses
      }
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// List

export type ListProps = SelectPrimitive.SelectListProps;

export const List = SelectPrimitive.SelectList;

// ------------------------------------------------------------------
// Row

export type RowProps = SelectPrimitive.SelectRowProps;

export const Row = SelectPrimitive.SelectRow;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = SelectPrimitive.SelectSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <SelectPrimitive.SelectSeparator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------

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

export type State = SelectPrimitive.SelectState;
