import { css, keyframes } from "../stitches";

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const menuContainerStyles = css({
  backgroundColor: "$gray2",
  paddingBlock: "$2",
  border: "1px solid $colors$gray8",
  boxShadow: "$4",
  borderRadius: "$md",
  overflow: "hidden",

  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
  animation: `${scaleIn} 0.1s ease-out`,
});

export const menuItemStyles = css({
  all: "unset",
  colorScheme: "primary",
  textStyle: "small-text",
  focusStyle: "inner",
  userSelect: "none",
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  paddingInline: "$4",
  paddingBlock: "$2",
  gap: "$3",
  minWidth: "200px",

  "&:focus": {
    backgroundColor: "$primary9",
    color: "$primary1",
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
