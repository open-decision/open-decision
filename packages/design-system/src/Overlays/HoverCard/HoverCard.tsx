import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { twMerge } from "../../utils";
import { arrowClasses, overlayClasses } from "../shared";

// ------------------------------------------------------------------
// Root

export type RootProps = HoverCardPrimitive.HoverCardProps;

export const Root = HoverCardPrimitive.Root;

// ------------------------------------------------------------------
// Trigger

const triggerClasses = "bg-transparent border-none";

export type TriggerProps = HoverCardPrimitive.HoverCardTriggerProps;

export const Trigger = ({ children, className, ...props }: TriggerProps) => {
  return (
    <HoverCardPrimitive.Trigger
      className={
        className ? twMerge(triggerClasses, className) : triggerClasses
      }
      {...props}
    >
      {children}
    </HoverCardPrimitive.Trigger>
  );
};

// ------------------------------------------------------------------
// Content

export type ContentProps = HoverCardPrimitive.PopperContentProps;

export const Content = ({ children, className, ...props }: ContentProps) => {
  return (
    <HoverCardPrimitive.Content
      className={
        className ? twMerge(overlayClasses, className) : overlayClasses
      }
      {...props}
    >
      {children}
    </HoverCardPrimitive.Content>
  );
};

// ------------------------------------------------------------------
// Arrow

export type ArrowProps = HoverCardPrimitive.HoverCardArrowProps;

export const Arrow = ({ children, className, ...props }: ArrowProps) => {
  return (
    <HoverCardPrimitive.Arrow
      className={className ? twMerge(arrowClasses, className) : arrowClasses}
      {...props}
    >
      {children}
    </HoverCardPrimitive.Arrow>
  );
};

// ------------------------------------------------------------------
