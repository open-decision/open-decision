import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { styled } from "../../stitches";
import { Icon } from "../../Icon/Icon";
import {
  menuContainerStyles,
  menuItemStyles,
  menuLabelStyles,
  menuSeparatorStyles,
} from "../shared";
import { CheckIcon } from "@radix-ui/react-icons";

const DropdownContext = React.createContext<null | {
  setOpenDialog: React.Dispatch<React.SetStateAction<string>>;
  dialogKeys: string[];
}>(null);

export const Root = ({
  children,
  dialogs,
  ...props
}: DropdownMenuRootProps) => {
  const [openDialog, setOpenDialog] = React.useState<
    keyof typeof dialogs | string
  >("");

  const Dialog = dialogs?.[openDialog];
  const EnhancedDialog = React.isValidElement(Dialog)
    ? React.cloneElement(Dialog, {
        open: true,
        setOpen: () => setOpenDialog(""),
      })
    : null;

  return (
    <>
      {EnhancedDialog}
      <DropdownContext.Provider
        value={
          dialogs ? { setOpenDialog, dialogKeys: Object.keys(dialogs) } : null
        }
      >
        <DropdownMenuPrimitives.Root {...props}>
          {children}
        </DropdownMenuPrimitives.Root>
      </DropdownContext.Provider>
    </>
  );
};

const DialogItemImpl = (
  { children, dialogKey, ...props }: DropdownMenuDialogItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const dropdownContext = React.useContext(DropdownContext);

  if (!dropdownContext)
    throw new Error(
      `DropdownMenu.DialogItems can only be used when the dialogs prop is set on the DialogMenu.Root component`
    );

  if (!dropdownContext.dialogKeys.includes(dialogKey))
    throw new Error(
      `The provided dialogKey ${dialogKey} does not exist on the dialog object passed to DropdownMenu.Root. Valid keys are ${dropdownContext.dialogKeys}`
    );

  return (
    <Item
      onClick={(event) => event.stopPropagation()}
      onSelect={() => dropdownContext.setOpenDialog(dialogKey)}
      ref={ref}
      {...props}
    >
      {children}
    </Item>
  );
};

export const DialogItem = React.forwardRef(DialogItemImpl);

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

export type DropdownMenuRootProps = DropdownMenuPrimitives.DropdownMenuProps & {
  dialogs?: Record<string, React.ReactNode>;
};
export type DropdownMenuTriggerProps =
  DropdownMenuPrimitives.DropdownMenuTriggerProps;
export type DropdownMenuContentProps = React.ComponentProps<typeof Content>;
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
  typeof TriggerItem
>;
export type DropdownMenuSeparatorProps = React.ComponentProps<typeof Separator>;

export const Content = styled(
  DropdownMenuPrimitives.Content,
  menuContainerStyles
);
export const Item = styled(DropdownMenuPrimitives.Item, menuItemStyles);
export const Label = styled(DropdownMenuPrimitives.Label, menuLabelStyles);
export const Trigger = DropdownMenuPrimitives.Trigger;
export const TriggerItem = styled(
  DropdownMenuPrimitives.TriggerItem,
  menuItemStyles
);
export const Separator = styled(
  DropdownMenuPrimitives.Separator,
  menuSeparatorStyles
);
