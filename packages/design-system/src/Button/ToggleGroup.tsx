import * as React from "react";
import { styled, StyleObject } from "../stitches";
import { ButtonProps, buttonStyles } from "../Button/Button";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";
import { Box } from "../Box";
import { ODProgrammerError } from "@open-decision/type-classes";

const StyledContainer = styled(Box, {
  borderRadius: "$md",
  layer: "4",
  padding: "$1",
  position: "relative",
  isolation: "isolate",

  variants: {
    raised: {
      true: {
        boxShadow: "$1",
      },
    },
  },

  defaultVariants: {
    raised: false,
  },
});

const StyledRoot = styled(ToggleGroupPrimitives.Root, {
  display: "inline-flex",
  gap: "$2",
  zIndex: "$10",

  variants: {
    layout: {
      vertical: { flexDirection: "column" },
      horizontal: {},
    },
  },

  defaultVariants: {
    layout: "horizontal",
  },
});

export type RootProps = React.ComponentProps<
  typeof ToggleGroupPrimitives.Root
> & { css?: StyleObject } & {
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
  ({ children, value, css, layout, raised, ...props }, ref) => {
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
        <StyledContainer ref={ref} css={css} raised={raised}>
          <StyledRoot layout={layout} {...props}>
            {children}
          </StyledRoot>
          {activeNode ? (
            <Box
              aria-hidden
              css={{
                position: "absolute",
                width: activeNode.offsetWidth,
                height: activeNode.offsetHeight,
                left: activeNode.offsetLeft,
                top: activeNode.offsetTop,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                css={{
                  width: "22px",
                  height: "22px",
                  backgroundColor: "$white",
                  borderRadius: "$md",
                  boxShadow: "$2",
                }}
              />
            </Box>
          ) : null}
        </StyledContainer>
      </ToggleContext.Provider>
    );
  }
);

export type ToggleItemProps = React.ComponentProps<typeof StyledItem>;
export type ToggleRootProps = React.ComponentProps<typeof Root>;
export type ToggleButtonProps = ButtonProps;

const StyledItem = styled(ToggleGroupPrimitives.Item, buttonStyles, {
  color: "$gray11",
  focusType: "outer",
  backgroundColor: "transparent",
});

export const Item = React.forwardRef<HTMLButtonElement, ToggleItemProps>(
  ({ children, value, ...props }, ref) => {
    const context = React.useContext(ToggleContext);

    if (!context)
      throw new ODProgrammerError({
        code: "MISSING_CONTEXT_PROVIDER",
        message: "The ToggleItem needs a ToggleRoot around it.",
      });

    return (
      <StyledItem
        variant="ghost"
        size="small"
        ref={(node) => {
          context.assignActiveNode(value)(node);
          if (typeof ref === "function") ref(node);
          if (ref && typeof ref === "object") ref.current = node;
        }}
        value={value}
        {...props}
      >
        {children}
      </StyledItem>
    );
  }
);
