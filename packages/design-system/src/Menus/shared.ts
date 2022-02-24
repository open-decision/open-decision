import { css, keyframes } from "../stitches";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const menuContainerStyles = css({
  layer: "1",
  paddingBlock: "$2",
  boxShadow: "$4",
  borderRadius: "$md",
  overflow: "hidden",
  zIndex: "$10",
  overflowY: "auto",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css({
  all: "unset",
  colorScheme: "primary",
  textStyle: "medium-text",
  focusStyle: "inner",
  userSelect: "none",
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  paddingInline: "$4",
  paddingBlock: "$2",
  gap: "$3",
  minWidth: "200px",
  alignItems: "center",
  wordBreak: "break-word",
  hyphens: "auto",
  borderBlock: "1px solid transparent",

  "&:focus, &[data-focus='true']": {
    backgroundColor: "$primary3",
    focusColor: "$primary3",
    borderColor: "$colors$primary6",
  },

  "&[data-disabled]": {
    color: "$gray11",
    pointerEvents: "none",
  },
});

export const menuLabelStyles = css({
  variants: {
    variant: {
      small: {
        textStyle: "small-text",
      },
      medium: {
        textStyle: "medium-text",
      },
    },
  },

  defaultVariants: {
    variant: "medium",
  },
});

export const menuSeparatorStyles = css({
  fill: "$gray8",
});
