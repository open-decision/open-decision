import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { darkTheme, keyframes, styled } from "@open-decision/design-system/src/stitches";
import { overlayCss } from "@open-decision/design-system/src/Overlays/shared";
import { Text } from "@open-decision/design-system/src/Text";
import { Stack } from "@open-decision/design-system/src/Layout";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const StyledContent = styled(TooltipPrimitive.Content, Stack, overlayCss, {
  textAlign: "center",
  maxWidth: "200px",
  gap: "$1",
  transformOrigin: "var(--radix-tooltip-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
  groupColor: "$gray12",
});

const Content = React.forwardRef(
  (props: TooltipContentProps, ref: React.Ref<HTMLDivElement>) => (
    <StyledContent sideOffset={10} className={darkTheme} ref={ref} {...props}>
      {props.children}
    </StyledContent>
  )
);

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: "$$bgColor",
});

const StyledTrigger = styled(TooltipPrimitive.Trigger, {});

const Body = styled(Text, {
  color: "$gray11",
});

const Portal = TooltipPrimitive.Portal;

export const Tooltip = {
  Root: TooltipPrimitive.Root,
  Trigger: StyledTrigger,
  Content: Content,
  Arrow: StyledArrow,
  Title: Text,
  Body,
  Provider: TooltipPrimitive.Provider,
  Portal,
};

export type TooltipRootProps = TooltipPrimitive.TooltipProps;
export type TooltipTriggerProps = TooltipPrimitive.TooltipTriggerProps;
export type TooltipContentProps = React.ComponentProps<typeof StyledContent>;
export type TooltipArrowProps = TooltipPrimitive.TooltipArrowProps;
export type TooltipPrviderProps = TooltipPrimitive.TooltipProviderProps;
