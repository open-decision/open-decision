import * as React from "react";
import * as ContextMenuPrimitives from "@radix-ui/react-context-menu";
import { Icon } from "../../Icon/Icon";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  menuContainerClasses,
  menuItemClasses,
  menuLabelClasses,
} from "../shared";
import { twMerge } from "../../utils";
import { separatorClasses } from "../../Separator/Separator";

// ------------------------------------------------------------------
// Root

export type RootProps = ContextMenuPrimitives.ContextMenuProps;
export const Root = ContextMenuPrimitives.Root;

// ------------------------------------------------------------------
// Trigger

export const Trigger = ContextMenuPrimitives.Trigger;
export type TriggerProps = ContextMenuPrimitives.ContextMenuTriggerProps;

// ------------------------------------------------------------------
// Content

export type ContentProps = ContextMenuPrimitives.ContextMenuContentProps;
export const Content = ({ className, children, ...props }: ContentProps) => {
  return (
    <ContextMenuPrimitives.Content
      className={
        className
          ? twMerge(menuContainerClasses, className)
          : menuContainerClasses
      }
      {...props}
    >
      {children}
    </ContextMenuPrimitives.Content>
  );
};

// ------------------------------------------------------------------
// Item

export type ItemProps = ContextMenuPrimitives.ContextMenuItemProps;
export const Item = ({ className, children, ...props }: ItemProps) => {
  return (
    <ContextMenuPrimitives.Item
      className={
        className ? twMerge(menuItemClasses, className) : menuItemClasses
      }
      {...props}
    >
      {children}
    </ContextMenuPrimitives.Item>
  );
};

// ------------------------------------------------------------------
// CheckboxItem

const ItemIndicator = () => {
  return (
    <Icon label="Checked" style={{ padding: 0 }}>
      <ContextMenuPrimitives.ItemIndicator asChild>
        <CheckIcon />
      </ContextMenuPrimitives.ItemIndicator>
    </Icon>
  );
};
export type CheckboxItemProps =
  ContextMenuPrimitives.ContextMenuCheckboxItemProps;

export const CheckboxItem = ({
  children,
  className,
  ...props
}: CheckboxItemProps) => {
  return (
    <ContextMenuPrimitives.CheckboxItem
      className={
        className ? twMerge(menuItemClasses, className) : menuItemClasses
      }
      {...props}
    >
      <ItemIndicator />
      {children}
    </ContextMenuPrimitives.CheckboxItem>
  );
};

// ------------------------------------------------------------------
// Label

export type LabelProps = ContextMenuPrimitives.ContextMenuLabelProps;

export const Label = ({ className, children, ...props }: LabelProps) => {
  return (
    <ContextMenuPrimitives.Label
      className={
        className ? twMerge(menuLabelClasses, className) : menuLabelClasses
      }
      {...props}
    >
      {children}
    </ContextMenuPrimitives.Label>
  );
};

// ------------------------------------------------------------------
// SubTriggerItem

export type SubTriggerItemProps = ContextMenuPrimitives.MenuSubTriggerProps;

export const SubTrigger = ({
  className,
  children,
  ...props
}: SubTriggerItemProps) => {
  return (
    <ContextMenuPrimitives.SubTrigger
      className={
        className ? twMerge(menuItemClasses, className) : menuItemClasses
      }
      {...props}
    >
      {children}
    </ContextMenuPrimitives.SubTrigger>
  );
};

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = ContextMenuPrimitives.ContextMenuSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <ContextMenuPrimitives.Separator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
