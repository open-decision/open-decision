import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { styled } from "../../stitches";
import { overlayCss } from "../shared";

const StyledContent = styled(HoverCardPrimitive.Content, overlayCss);

const StyledArrow = styled(HoverCardPrimitive.Arrow, {
  fill: "var(--bgColor)",
});

const StyledTrigger = styled(HoverCardPrimitive.Trigger, {
  backgroundColor: "transparent",
  border: "none",
});

export const HoverCard = {
  Root: HoverCardPrimitive.Root,
  Trigger: StyledTrigger,
  Content: StyledContent,
  Arrow: StyledArrow,
};

export type HoverCardRootProps = HoverCardPrimitive.HoverCardProps;
export type HoverCardTriggerProps = HoverCardPrimitive.HoverCardTriggerProps;
export type HoverCardContentProps = React.ComponentProps<typeof StyledContent>;
export type HoverCardArrowProps = HoverCardPrimitive.HoverCardArrowProps;
