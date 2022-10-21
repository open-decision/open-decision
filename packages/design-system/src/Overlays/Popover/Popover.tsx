import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { styled } from "@open-decision/design-system/src/stitches";
import { overlayCss } from "@open-decision/design-system/src/Overlays/shared";

const StyledContent = styled(PopoverPrimitive.Content, overlayCss);

const StyledArrow = styled(PopoverPrimitive.Arrow, {
  fill: "var(--bgColor)",
});

export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Content: StyledContent,
  Arrow: StyledArrow,
  Anchor: PopoverPrimitive.Anchor,
  Close: PopoverPrimitive.Close,
};

export type PopoverRootProps = PopoverPrimitive.PopoverProps;
export type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps;
export type PopoverContentProps = React.ComponentProps<typeof StyledContent>;
export type PopoverArrowProps = PopoverPrimitive.PopoverArrowProps;
export type PopoverAnchor = PopoverPrimitive.PopoverAnchorProps;
