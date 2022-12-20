import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { stackClasses } from "../../Layout";
import { twMerge } from "../../utils";
import { arrowClasses, overlayClasses } from "../shared";

// ------------------------------------------------------------------
// Root

export type RootProps = TooltipPrimitive.TooltipProps;

export const Root = TooltipPrimitive.Root;

// ------------------------------------------------------------------
// Content

const contentClasses = twMerge(
  stackClasses({}),
  overlayClasses,
  "medium-text align-center max-w-[200px] gap-1 origin-[var(--radix-tooltip-content-transform-origin)] animate-scaleIn bg-slate-900 text-white"
);

export type ContentProps = TooltipPrimitive.PopperContentProps;

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, ...props }, ref) => (
    <TooltipPrimitive.Content
      className={
        className ? twMerge(contentClasses, className) : contentClasses
      }
      sideOffset={10}
      ref={ref}
      {...props}
    >
      {props.children}
    </TooltipPrimitive.Content>
  )
);

// ------------------------------------------------------------------
// Arrow

export type TooltipArrowProps = TooltipPrimitive.PopperArrowProps;

export const Arrow = ({ className, ...props }: TooltipArrowProps) => {
  return (
    <TooltipPrimitive.Arrow
      className={className ? twMerge(arrowClasses, className) : arrowClasses}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = TooltipPrimitive.TooltipTriggerProps;

export const Trigger = TooltipPrimitive.Trigger;

// ------------------------------------------------------------------
// Portal

export type PortalProps = TooltipPrimitive.PortalProps;

export const Portal = TooltipPrimitive.Portal;

// ------------------------------------------------------------------
// Provider

export type TooltipProviderProps = TooltipPrimitive.TooltipProviderProps;

export const Provider = TooltipPrimitive.Provider;

// ------------------------------------------------------------------
