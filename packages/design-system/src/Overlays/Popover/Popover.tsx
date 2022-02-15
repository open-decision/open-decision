import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { styled } from "../../stitches";
import { overlayCss } from "../shared";

const StyledContent = styled(PopoverPrimitive.Content, overlayCss);

const StyledArrow = styled(PopoverPrimitive.Arrow, {
  fill: "var(--bgColor)",
});

export const Popover = {
  ...PopoverPrimitive,
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Content: StyledContent,
  Arrow: StyledArrow,
};

export type PopoverRootProps = PopoverPrimitive.PopoverProps;
export type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps;
export type PopoverContentProps = React.ComponentProps<typeof StyledContent>;
export type PopoverArrowProps = PopoverPrimitive.PopoverArrowProps;
export type PopoverAnchor = PopoverPrimitive.PopoverAnchorProps;
