import * as React from "react";
import * as TooltipPrimtive from "@radix-ui/react-tooltip";
import { styled, keyframes } from "../index";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const StyledContent = styled(TooltipPrimtive.Content, {
  $bgColor: "$colors$gray1",
  backgroundColor: "var(--bgColor)",
  borderRadius: "$md",
  boxShadow: "$2",
  padding: "$4",

  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledArrow = styled(TooltipPrimtive.Arrow, {
  fill: "var(--bgColor)",
});

export const Tooltip = {
  Root: TooltipPrimtive.Root,
  Trigger: TooltipPrimtive.Trigger,
  Content: StyledContent,
  Arrow: StyledArrow,
};

export type TooltipRootProps = TooltipPrimtive.TooltipProps;
export type TooltipTriggerProps = TooltipPrimtive.TooltipTriggerProps;
export type TooltipContentProps = React.ComponentProps<typeof StyledContent>;
export type TooltipArrowProps = TooltipPrimtive.TooltipArrowProps;
