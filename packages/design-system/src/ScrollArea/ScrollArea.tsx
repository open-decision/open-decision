import * as React from "react";
import { styled } from "../stitches";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export const Root = styled(ScrollAreaPrimitive.Root, {
  minHeight: "200px",
  maxHeight: "500px",
  padding: "$2",
  layer: "2",
  overflow: "hidden",
  border: "1px solid $gray7",
  focusType: "inner-within",
  borderBottomLeftRadius: "$md",
  borderBottomRightRadius: "$md",
});

export const Viewport = styled(ScrollAreaPrimitive.Viewport, {
  height: "100%",
  width: "100%",
  borderRadius: "inherit",
});

export const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: "none",
  padding: 2,
  background: "$gray6",
  transition: "background 160ms ease-out",
  "&:hover": { background: "$gray8" },
  '&[data-orientation="vertical"]': { width: 10 },
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
    height: 10,
  },
});

const Thumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: "$gray9",
  // opacity: 0.5,
  borderRadius: 10,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 44,
    minHeight: 44,
  },
});

export const Scrollbar = (props: ScrollbarProps) => (
  <StyledScrollbar data-scrollbar {...props}>
    <Thumb />
  </StyledScrollbar>
);

export type RootProps = ScrollAreaPrimitive.ScrollAreaProps;
export type ViewportProps = ScrollAreaPrimitive.ScrollAreaViewportProps;
export type ScrollbarProps = ScrollAreaPrimitive.ScrollAreaScrollbarProps;
export type ConrnerProps = ScrollAreaPrimitive.ScrollAreaCornerProps;
