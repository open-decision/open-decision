import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { darkTheme, styled } from "../../stitches";
import { overlayCss } from "../shared";
import { Text } from "../../Text";
import { Stack } from "../../Layout";

const StyledContent = styled(TooltipPrimitive.Content, Stack, overlayCss, {
  textAlign: "center",
  maxWidth: "200px",
  gap: "$1",
});

const Content = (props: TooltipContentProps) => (
  <StyledContent sideOffset={10} className={darkTheme} mode="dark" {...props}>
    {props.children}
  </StyledContent>
);

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: "$$bgColor",
});

const StyledTrigger = styled(TooltipPrimitive.Trigger, {
  backgroundColor: "transparent",
});

const Body = styled(Text, {
  color: "$gray11",
});

export const Tooltip = {
  Root: TooltipPrimitive.Root,
  Trigger: StyledTrigger,
  Content: Content,
  Arrow: StyledArrow,
  Title: Text,
  Body,
  Provider: TooltipPrimitive.Provider,
};

export type TooltipRootProps = TooltipPrimitive.TooltipProps;
export type TooltipTriggerProps = TooltipPrimitive.TooltipTriggerProps;
export type TooltipContentProps = React.ComponentProps<typeof StyledContent>;
export type TooltipArrowProps = TooltipPrimitive.TooltipArrowProps;
export type TooltipPrviderProps = TooltipPrimitive.TooltipProviderProps;
