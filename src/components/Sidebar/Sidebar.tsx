import React from "react";
import { useKeyPressEvent } from "react-use";
import {
  IconButton,
  keyframes,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronLeft, ChevronRight } from "react-feather";

const Sidebar = styled(Collapsible.Root, {
  overflow: "hidden",
});

const rotateLeft = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(180deg)" },
});

const rotateRight = keyframes({
  from: { transform: "rotate(180deg)" },
  to: { transform: "rotate(0deg)" },
});

const ToggleButton = styled(IconButton, {
  colorScheme: "gray",

  '&[data-state="open"] > .icon': {
    animation: `${rotateLeft} 200ms ease-in forwards`,
  },

  '&[data-state="closed"] > .icon': {
    animation: `${rotateRight} 200ms ease-in forwards`,
  },
});

type SidebarProps = React.ComponentProps<typeof Sidebar>;

export const SidebarRoot = ({
  children,
  open,
  onOpenChange,
  ...props
}: SidebarProps): JSX.Element => {
  useKeyPressEvent("Escape", () => (onOpenChange ? onOpenChange(false) : null));

  return (
    <Sidebar open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Sidebar>
  );
};

type ToggleProps = React.ComponentProps<typeof Collapsible.Trigger> & {
  position?: "left" | "right";
  css?: StyleObject;
};
export function SidebarToggle({
  position = "left",
  css,
  ...props
}: ToggleProps): JSX.Element {
  return (
    <Collapsible.Trigger asChild {...props}>
      <ToggleButton
        variant="primary"
        css={css}
        label="Öffne die Sidebar"
        Icon={
          position === "left" ? (
            <ChevronRight className="icon" />
          ) : (
            <ChevronLeft className="icon" />
          )
        }
      />
    </Collapsible.Trigger>
  );
}

export const SidebarContent = styled(Collapsible.Content, {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$gray2",
  boxShadow: "$xl",
  gap: "$6",
  overflowY: "scroll",

  "&[data-state='open']": {
    padding: "$4",
  },
});
