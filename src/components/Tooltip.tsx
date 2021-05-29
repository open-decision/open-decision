import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Slot } from "@radix-ui/react-slot";
import { styled } from "utils/stitches.config";

const Content = styled(TooltipPrimitive.Content, {
  backgroundColor: "$gray200",
  padding: "$1 $2",
});

export type TooltipProps = {
  content: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<typeof Content>;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}) => (
  <TooltipPrimitive.Root
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
  >
    <TooltipPrimitive.Trigger as={Slot}>{children}</TooltipPrimitive.Trigger>
    <Content side="top" align="center" sideOffset={10} {...props}>
      {content}
    </Content>
  </TooltipPrimitive.Root>
);
