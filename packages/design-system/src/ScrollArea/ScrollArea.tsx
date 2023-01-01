import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { twMerge } from "../utils";

// ------------------------------------------------------------------
// Root

export type RootProps = ScrollAreaPrimitive.ScrollAreaProps;

export const Root = ScrollAreaPrimitive.Root;

// ------------------------------------------------------------------
// ViewPort

const viewportClasses = "rounded-inherit";

export type ViewportProps = ScrollAreaPrimitive.ScrollAreaViewportProps;
export const Viewport = ({ className, children, ...props }: ViewportProps) => {
  return (
    <ScrollAreaPrimitive.Viewport
      className={
        className ? twMerge(viewportClasses, className) : viewportClasses
      }
      {...props}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  );
};

// ------------------------------------------------------------------
// Scrollbar

export type ScrollbarProps = ScrollAreaPrimitive.ScrollAreaScrollbarProps;

const scrollbarClasses =
  "bg-gray5 flex select-none touch-none p-[2px] transition-colors duration-[160ms] ease-out hover:bg-gray7 data-[orientation='vertical']:w-[10px] data-[orientation='horizontal']:flex-col data-[orientation='horizontal']:h-10";

const thumbClasses =
  "flex-1 bg-gray1 rounded-[10px] relative before:[content=''] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]";

export const Scrollbar = ({ className, ...props }: ScrollbarProps) => (
  <ScrollAreaPrimitive.Scrollbar
    data-scrollbar
    className={
      className ? twMerge(scrollbarClasses, className) : scrollbarClasses
    }
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className={thumbClasses} />
  </ScrollAreaPrimitive.Scrollbar>
);
