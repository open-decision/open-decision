import React from "react";
import {
  ChevronLeftSolid,
  ChevronRightSolid,
} from "@graywolfai/react-heroicons";
import { useKeyPressEvent } from "react-use";
import { keyframes, styled } from "utils/stitches.config";
import * as Collapsible from "@radix-ui/react-collapsible";

const Sidebar = styled(Collapsible.Root, {
  display: "flex",
});

const rotateLeft = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(180deg)" },
});

const rotateRight = keyframes({
  from: { transform: "rotate(180deg)" },
  to: { transform: "rotate(0deg)" },
});

const Toggle = styled(Collapsible.Button, {
  margin: "$4",
  width: "40px",
  height: "40px",
  padding: "$1",
  borderRadius: "$md",
  backgroundColor: "$warmGray200",

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

type ToggleProps = React.ComponentProps<typeof Toggle> & {
  position?: "left" | "right";
};
export function SidebarToggle({
  position = "left",
  ...props
}: ToggleProps): JSX.Element {
  return (
    <Toggle {...props}>
      {position === "left" ? (
        <ChevronRightSolid className="icon" />
      ) : (
        <ChevronLeftSolid className="icon" />
      )}
    </Toggle>
  );
}

export const SidebarContent = styled(Collapsible.Content, {
  backgroundColor: "$warmGray100",
  padding: "$4",
  boxShadow: "$xl",
});
