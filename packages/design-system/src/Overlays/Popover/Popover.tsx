import * as PopoverPrimitive from "@radix-ui/react-popover";
import { twMerge } from "../../utils";
import { arrowClasses, overlayClasses } from "../shared";

// ------------------------------------------------------------------
// Root

export type RootProps = PopoverPrimitive.PopoverProps;

export const Root = PopoverPrimitive.Root;

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = PopoverPrimitive.PopoverTriggerProps;

export const Trigger = PopoverPrimitive.Trigger;

// ------------------------------------------------------------------
// Content

export type ContentProps = PopoverPrimitive.PopperContentProps;

export const Content = ({
  children,
  className,
  sideOffset = 10,
  ...props
}: ContentProps) => {
  return (
    <PopoverPrimitive.Content
      className={
        className ? twMerge(overlayClasses, className) : overlayClasses
      }
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  );
};

// ------------------------------------------------------------------
// Arrow

export type PopoverArrowProps = PopoverPrimitive.PopoverArrowProps;

export const Arrow = ({ className, ...props }: PopoverArrowProps) => {
  return (
    <PopoverPrimitive.Arrow
      className={className ? twMerge(arrowClasses, className) : arrowClasses}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Anchor

export type PopoverAnchor = PopoverPrimitive.PopoverAnchorProps;

export const Anchor = PopoverPrimitive.Anchor;

// ------------------------------------------------------------------
// Close

export type PopoverClose = PopoverPrimitive.PopoverCloseProps;

export const Close = PopoverPrimitive.Close;

// ------------------------------------------------------------------
