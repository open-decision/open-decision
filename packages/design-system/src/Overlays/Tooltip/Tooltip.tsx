import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { styled } from "../../stitches";
import { overlayCss } from "../shared";

const StyledContent = styled(TooltipPrimitive.Content, overlayCss);

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: "var(--bgColor)",
});

const StyledTrigger = styled(TooltipPrimitive.Trigger, {
  backgroundColor: "transparent",
  border: "none",
});

export const Tooltip = {
  Root: TooltipPrimitive.Root,
  Trigger: StyledTrigger,
  Content: StyledContent,
  Arrow: StyledArrow,
};

export type TooltipRootProps = TooltipPrimitive.TooltipProps;
export type TooltipTriggerProps = TooltipPrimitive.TooltipTriggerProps;
export type TooltipContentProps = React.ComponentProps<typeof StyledContent>;
export type TooltipArrowProps = TooltipPrimitive.TooltipArrowProps;
