import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { styled, StyleObject } from "@open-decision/design-system/src/stitches";
import { Icon } from "@open-decision/design-system/src/Icon/Icon";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "@open-decision/design-system/src/Menus/shared";
import {
  CheckIcon,
  TriangleDownIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import { Button as SystemButton, ButtonProps } from "@open-decision/design-system/src/Button";
import { Row } from "@open-decision/design-system/src/Layout";

export const Root = DropdownMenuPrimitives.Root;

type IndicatorProps = { children?: React.ReactNode };

const ItemIndicator = ({ children }: IndicatorProps) => {
  return (
    <DropdownMenuPrimitives.ItemIndicator asChild>
      {children ? (
        children
      ) : (
        <Icon label="Checked" css={{ padding: 0 }}>
          <CheckIcon />
        </Icon>
      )}
    </DropdownMenuPrimitives.ItemIndicator>
  );
};

const StyledCheckboxItem = styled(
  DropdownMenuPrimitives.CheckboxItem,
  menuItemStyles,
  { justifyContent: "space-between" }
);

type CheckboxItemProps = DropdownCheckboxItemProps & { Icon?: React.ReactNode };

export const CheckboxItem = ({
  children,
  Icon,
  ...props
}: CheckboxItemProps) => {
  return (
    <StyledCheckboxItem {...props}>
      {children}
      <ItemIndicator>{Icon}</ItemIndicator>
    </StyledCheckboxItem>
  );
};

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

function DropdownButtonImpl(
  { children, css, ...props }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <SystemButton
      css={{
        gap: "$1",

        "&[data-state='open'] .rotate": {
          transform: "rotate(180deg)",
        },
        ...css,
      }}
      ref={ref}
      {...props}
    >
      <Row as="span" css={{ gap: "$2" }}>
        {children}
      </Row>
      <Icon
        className="rotate"
        css={{
          transition: "transform 200ms ease-in-out",
        }}
      >
        <TriangleDownIcon />
      </Icon>
    </SystemButton>
  );
}

const StyledSubTriggerItem = styled(
  DropdownMenuPrimitives.SubTrigger,
  menuItemStyles
);

export const SubTrigger = ({
  children,
  css,
  ...props
}: DropdownMenuTriggerItemProps) => (
  <StyledSubTriggerItem css={{ ...css }} {...props}>
    {children}
    <Icon css={{ marginLeft: "auto" }}>
      <TriangleRightIcon />
    </Icon>
  </StyledSubTriggerItem>
);

export const Sub = DropdownMenuPrimitives.Sub;
export const Portal = DropdownMenuPrimitives.Portal;

export const Button = React.forwardRef(DropdownButtonImpl);

export type DropdownMenuRootProps = DropdownMenuPrimitives.DropdownMenuProps & {
  dialogs?: Record<string, React.ReactNode>;
};
export type DropdownMenuTriggerProps =
  DropdownMenuPrimitives.DropdownMenuTriggerProps;
export type DropdownMenuContentProps =
  DropdownMenuPrimitives.DropdownMenuContentProps & { css?: StyleObject };
export type DropdownMenuItemProps = React.ComponentProps<typeof Item>;
export type DropdownMenuDialogItemProps = Omit<
  DropdownMenuItemProps,
  "onSelect" | "onClick"
> & { dialogKey: string };

export type DropdownCheckboxItemProps = React.ComponentProps<
  typeof StyledCheckboxItem
>;
export type DropdownMenuLabelProps = React.ComponentProps<typeof Label>;
export type DropdownMenuTriggerItemProps = React.ComponentProps<
  typeof StyledSubTriggerItem
>;
export type DropdownMenuSeparatorProps = React.ComponentProps<typeof Separator>;

export const Content = ({
  className,
  children,
  css,
  hidden,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuPrimitives.Content
      className={
        !hidden ? `${menuContainerStyles({ css })} ${className}` : undefined
      }
      hidden={hidden}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Content>
  );
};

export const SubContent = ({
  className,
  children,
  css,
  hidden,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuPrimitives.SubContent
      className={
        !hidden ? `${menuContainerStyles({ css })} ${className}` : undefined
      }
      hidden={hidden}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.SubContent>
  );
};

Content.defaultProps = { sideOffset: 5 };
SubContent.defaultProps = { sideOffset: 5 };

export const Item = styled(DropdownMenuPrimitives.Item, menuItemStyles);
export const Label = styled(DropdownMenuPrimitives.Label, menuLabelStyles);
export const Trigger = DropdownMenuPrimitives.Trigger;

export const Separator = styled(
  DropdownMenuPrimitives.Separator,
  menuSeparatorStyles
);
