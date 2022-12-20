import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { Icon } from "../../Icon/Icon";
import {
  CheckIcon,
  TriangleDownIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import { buttonClasses, ButtonProps } from "../../Button";
import { separatorClasses } from "../../Separator/Separator";
import {
  menuContainerClasses,
  menuItemClasses,
  menuLabelClasses,
} from "../shared";
import { twMerge } from "../../utils";

// ------------------------------------------------------------------
// Root

export type RootProps = DropdownMenuPrimitives.DropdownMenuProps;

export const Root = DropdownMenuPrimitives.Root;

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = DropdownMenuPrimitives.DropdownMenuTriggerProps;
export const Trigger = DropdownMenuPrimitives.Trigger;

// ------------------------------------------------------------------
// SubTrigger

export type SubTriggerItemProps =
  DropdownMenuPrimitives.DropdownMenuSubTriggerProps;

export const SubTriggerItem = ({
  children,
  className,
  ...props
}: SubTriggerItemProps) => (
  <DropdownMenuPrimitives.SubTrigger
    className={
      className ? twMerge(menuItemClasses, className) : menuItemClasses
    }
    {...props}
  >
    {children}
    <Icon style={{ marginLeft: "auto" }}>
      <TriangleRightIcon />
    </Icon>
  </DropdownMenuPrimitives.SubTrigger>
);

// ------------------------------------------------------------------
// Item

export type ItemProps = DropdownMenuPrimitives.DropdownMenuItemProps;

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DropdownMenuPrimitives.Item
        ref={ref}
        className={
          className ? twMerge(menuItemClasses, className) : menuItemClasses
        }
        {...props}
      >
        {children}
      </DropdownMenuPrimitives.Item>
    );
  }
);

// ------------------------------------------------------------------
// CheckboxItem
type IndicatorProps = { children?: React.ReactNode };

const ItemIndicator = ({ children }: IndicatorProps) => {
  return (
    <DropdownMenuPrimitives.ItemIndicator asChild>
      {children ? (
        children
      ) : (
        <Icon label="Checked" style={{ padding: 0 }}>
          <CheckIcon />
        </Icon>
      )}
    </DropdownMenuPrimitives.ItemIndicator>
  );
};

type CheckboxItemProps = DropdownMenuPrimitives.MenuCheckboxItemProps & {
  Icon?: React.ReactNode;
};

export const CheckboxItem = ({
  children,
  Icon,
  className,
  ...props
}: CheckboxItemProps) => {
  return (
    <DropdownMenuPrimitives.CheckboxItem
      className={
        className ? twMerge(menuItemClasses, className) : menuItemClasses
      }
      {...props}
    >
      {children}
      <ItemIndicator>{Icon}</ItemIndicator>
    </DropdownMenuPrimitives.CheckboxItem>
  );
};

// ------------------------------------------------------------------
// CheckboxGroup

type CheckboxGroupProps<TOptions extends Record<string, string>> = {
  selected?: keyof TOptions;
  options: TOptions;
  toggleOption: (newOption: keyof TOptions) => void;
};

export function CheckboxGroup<TOptions extends Record<string, string>>({
  selected,
  options,
  toggleOption,
}: CheckboxGroupProps<TOptions>) {
  return (
    <>
      {Object.entries(options).map(([key, optionText]) => {
        return optionText ? (
          <CheckboxItem
            key={key}
            checked={selected === key}
            onSelect={() => toggleOption(key)}
          >
            {optionText}
          </CheckboxItem>
        ) : null;
      })}
    </>
  );
}

// ------------------------------------------------------------------
// DropdownButton

const dropdownButtonClasses = "gap-1 group";
const dropdownRotatingIndicatorClasses =
  "p-0 group-data-state-open:rotate-180 transition-transform duration-200 ease-in-out";

export type DropdownButtonProps = ButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  (
    {
      children,
      style,
      size,
      variant,
      square,
      round,
      alignByContent,
      className,
      classNames,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonClasses(
          { round, size, variant, square, alignByContent },
          [dropdownButtonClasses, classNames, className]
        )}
        style={style}
        ref={ref}
        {...props}
      >
        {children}
        <Icon className={dropdownRotatingIndicatorClasses}>
          <TriangleDownIcon />
        </Icon>
      </button>
    );
  }
);

// ------------------------------------------------------------------
// Portal

export type PortalProps = DropdownMenuPrimitives.MenuPortalProps;

export const Portal = DropdownMenuPrimitives.Portal;

// ------------------------------------------------------------------
// Content

export type ContentProps = DropdownMenuPrimitives.MenuContentProps;

export const Content = ({
  className,
  children,
  hidden,
  sideOffset = 5,
  ...props
}: ContentProps) => {
  return (
    <DropdownMenuPrimitives.Content
      className={!hidden ? twMerge(menuContainerClasses, className) : undefined}
      hidden={hidden}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Content>
  );
};

// ------------------------------------------------------------------
// SubContent

export const SubContent = ({
  className,
  children,
  hidden,
  sideOffset = 5,
  ...props
}: ContentProps) => {
  return (
    <DropdownMenuPrimitives.SubContent
      className={!hidden ? twMerge(menuContainerClasses, className) : undefined}
      sideOffset={sideOffset}
      hidden={hidden}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.SubContent>
  );
};

// ------------------------------------------------------------------
// Label

export type LabelProps = DropdownMenuPrimitives.MenuLabelProps;

export const Label = ({ className, children, ...props }: LabelProps) => {
  return (
    <DropdownMenuPrimitives.Label
      className={
        className ? twMerge(menuLabelClasses, className) : menuLabelClasses
      }
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Label>
  );
};

// ------------------------------------------------------------------
// Sub
export type SubProps = DropdownMenuPrimitives.DropdownMenuSubProps;

export const Sub = DropdownMenuPrimitives.Sub;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = DropdownMenuPrimitives.MenuSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <DropdownMenuPrimitives.Separator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
