import * as React from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { styled, keyframes } from "../stitches";
import { Icon } from "../IconButton";
import { Check } from "../icons";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const Root = styled(DropdownMenuPrimitives.Root, {});
const Content = styled(DropdownMenuPrimitives.Content, {
  backgroundColor: "$gray2",
  padding: "$2",
  border: "1px solid $colors$gray8",
  boxShadow: "$4",
  borderRadius: "$md",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});
const Item = styled(DropdownMenuPrimitives.Item, {
  all: "unset",
  colorScheme: "primary",
  textStyle: "medium-text",
  focusStyle: "inner",
  userSelect: "none",
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  alignItems: "center",
  borderRadius: "$md",
  paddingInline: "$4",
  paddingBlock: "$2",
  gap: "$3",

  "&:focus": {
    backgroundColor: "$colorScheme9",
    color: "$colorScheme1",
  },

  "&[data-disabled]": {
    color: "$colorScheme8",
    pointerEvents: "none",
  },
});
const Trigger = styled(DropdownMenuPrimitives.Trigger, {});
const Label = styled(DropdownMenuPrimitives.Label, {
  variants: {
    variant: {
      small: {
        textStyle: "small-text",
      },
      medium: {
        textStyle: "medium-text",
      },
    },
  },

  defaultVariants: {
    variant: "medium",
  },
});

const TriggerItem = styled(DropdownMenuPrimitives.TriggerItem, Item);

const ItemIndicator = () => {
  return (
    <Icon label="Checked" css={{ padding: 0 }}>
      <DropdownMenuPrimitives.ItemIndicator asChild>
        <Check />
      </DropdownMenuPrimitives.ItemIndicator>
    </Icon>
  );
};
const StyledCheckboxItem = styled(DropdownMenuPrimitives.CheckboxItem, Item);

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
  Root,
  Content,
  Item,
  CheckboxItem,
  Label,
  Trigger,
  TriggerItem,
};
