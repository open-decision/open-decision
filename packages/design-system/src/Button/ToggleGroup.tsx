import * as React from "react";
import { buttonClasses, ButtonProps, ButtonVariants } from "../Button/Button";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";
import { ODProgrammerError } from "@open-decision/type-classes";
import { cva } from "class-variance-authority";
import { twMerge } from "../utils";

const container = cva(["rounded-md bg-layer-4 p-1 relative isolate"], {
  variants: {
    raised: {
      true: "shadow-2",
    },
  },

  defaultVariants: {
    raised: false,
  },
});

const root = cva(["inline-flex gap-2 justify-between w-full"], {
  variants: {
    layout: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

export type RootProps = React.ComponentProps<
  typeof ToggleGroupPrimitives.Root
> & {
  className?: string;
  layout?: "vertical" | "horizontal";
  raised?: boolean;
};

type assignActiveNode = (
  itemValue: string
) => (node: HTMLButtonElement | null) => void;
const ToggleContext = React.createContext<null | {
  assignActiveNode: assignActiveNode;
}>(null);

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ children, value, className, layout, raised, ...props }, ref) => {
    const [activeNode, setActiveNode] =
      React.useState<null | HTMLButtonElement>(null);

    const assignActiveNode: assignActiveNode = (itemValue) => (node) => {
      if (node && itemValue === value) {
        setActiveNode(node);
      } else if (value === "") {
        setActiveNode(null);
      }

      return node;
    };

    return (
      <ToggleContext.Provider value={{ assignActiveNode }}>
        <div className={twMerge(container({ raised, className }))} ref={ref}>
          {activeNode ? (
            <div
              aria-hidden
              className="absolute transition-all duration-200 ease-in-out flex justify-center items-center"
              style={{
                width: activeNode.offsetWidth,
                height: activeNode.offsetHeight,
                left: activeNode.offsetLeft,
                top: activeNode.offsetTop,
              }}
            >
              <div className="w-full h-full bg-white rounded-md shadow-3" />
            </div>
          ) : null}
          <ToggleGroupPrimitives.Root className={root({ layout })} {...props}>
            {children}
          </ToggleGroupPrimitives.Root>
        </div>
      </ToggleContext.Provider>
    );
  }
);

export type ToggleItemProps = ToggleGroupPrimitives.ToggleGroupItemProps &
  ButtonVariants;
export type ToggleRootProps = React.ComponentProps<typeof Root>;
export type ToggleButtonProps = ButtonProps;

export const Item = React.forwardRef<HTMLButtonElement, ToggleItemProps>(
  (
    {
      children,
      value,
      className,
      square = false,
      size = "small",
      variant = "ghost",
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ToggleContext);

    if (!context)
      throw new ODProgrammerError({
        code: "MISSING_CONTEXT_PROVIDER",
        message: "The ToggleItem needs a ToggleRoot around it.",
      });

    return (
      <ToggleGroupPrimitives.Item
        className={twMerge(
          buttonClasses({ size, variant, square }),
          "text-gray11 bg-transparent flex-1 z-10",
          className
        )}
        ref={(node) => {
          context.assignActiveNode(value)(node);
          if (typeof ref === "function") ref(node);
          if (ref && typeof ref === "object") ref.current = node;
        }}
        value={value}
        {...props}
      >
        {children}
      </ToggleGroupPrimitives.Item>
    );
  }
);
