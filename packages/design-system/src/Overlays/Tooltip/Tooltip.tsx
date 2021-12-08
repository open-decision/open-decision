import * as React from "react";
import * as TooltipPrimtive from "@radix-ui/react-tooltip";
import { styled } from "../../stitches";
import { overlayCss } from "../shared";

const StyledContent = styled(TooltipPrimtive.Content, overlayCss);

const StyledArrow = styled(TooltipPrimtive.Arrow, {
  fill: "var(--bgColor)",
});

const StyledTrigger = styled(TooltipPrimtive.Trigger, {
  all: "unset",
});

export const Tooltip = {
  Root: TooltipPrimtive.Root,
  Trigger: StyledTrigger,
  Content: StyledContent,
  Arrow: StyledArrow,
};

export type TooltipRootProps = TooltipPrimtive.TooltipProps;
export type TooltipTriggerProps = TooltipPrimtive.TooltipTriggerProps;
export type TooltipContentProps = React.ComponentProps<typeof StyledContent>;
export type TooltipArrowProps = TooltipPrimtive.TooltipArrowProps;
